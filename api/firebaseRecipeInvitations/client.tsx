import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useSession } from '../../api/firebaseAuthentication/client';
import { db } from '../../FirebaseConfig'
import { router } from 'expo-router';

// Define the interface for the invitation context
interface InvitationContextType {
  processNextInvitation: () => void;
  invitationQueue: any[];
  openNextInvitation: () => void;
  invitationData: any;
}

// Define the default values for the invitation context
const defaultInvitationContextValue: InvitationContextType = {
  processNextInvitation: () => {},
  invitationQueue: [null],
  openNextInvitation: () => {},
  invitationData: null,
};

// Create an invitation context with default values
const InvitationContext = createContext<InvitationContextType>(defaultInvitationContextValue);

// Custom hook to use the invitation context
export const useInvitation = () => useContext(InvitationContext);

export { InvitationContext };

// Define props for the InvitationProvider component
interface InvitationProviderProps {
  children: ReactNode;
}

// Create an InvitationProvider component to manage invitation-related state
export const InvitationProvider: React.FC<InvitationProviderProps> = ({ children }) => {
  // Get the current user's session
  const { session } = useSession();
  const userID = session;

  // State variables to store the invitation queue and the current invitation data
  const [invitationQueue, setInvitationQueue] = useState<any[]>([]);
  const [invitationData, setInvitationData] = useState(null);

  // Function to open the next invitation in the queue
  const openNextInvitation = () => {
    if (invitationQueue.length > 0) {
      const nextInvitation = invitationQueue[0];
      setInvitationData(nextInvitation);
      router.push("/modals/showSharedRecipeInvitation");
    }
  };

  // Function to process the next invitation in the queue
  const processNextInvitation = () => {
    if (invitationQueue.length > 0) {
      setInvitationQueue((prevQueue) => prevQueue.slice(1));
      openNextInvitation();
    } else {
      router.back();
    }
  };

  // Effect to listen for new invitations and update the invitation queue
  useEffect(() => {
    if (userID) {
      // Create a query to fetch pending invitations for the current user
      const q = query(collection(db, "invitations"), where("receiverId", "==", userID), where("status", "==", "pending"));
      
      // Subscribe to changes in the query result
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newInvitations = [];
        querySnapshot.forEach((doc) => {
          const invitationData = doc.data();
          newInvitations.push({ id: doc.id, ...invitationData });
        });

        setInvitationQueue((prevQueue) => {
          // Check if new invitations were added and the queue was empty
          const shouldOpenNextInvitation = prevQueue.length === 0 && newInvitations.length > 0;
          const updatedQueue = [...prevQueue, ...newInvitations];

          // If the queue was empty and new invitations were added
          if (shouldOpenNextInvitation) {
            setInvitationData(updatedQueue[0]);
            router.push("/modals/showSharedRecipeInvitation");
          }

          return updatedQueue;
        });
      });

      return () => unsubscribe();
    }
  }, [userID]);

    return (
        <InvitationContext.Provider value={{ invitationData, openNextInvitation, invitationQueue, processNextInvitation }}>
            {children}
        </InvitationContext.Provider>
    );
};