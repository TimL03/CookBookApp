import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useSession } from '../../api/firebaseAuthentication/client';
import { db } from '../../FirebaseConfig'
import { router } from 'expo-router';

interface InvitationContextType {
    processNextInvitation:  () => void; 
    invitationQueue: any[];
    openNextInvitation: () => void;
    invitationData: any; 
  }

  const defaultInvitationContextValue: InvitationContextType = {
    processNextInvitation: () => {},
    invitationQueue: [null],
    openNextInvitation: () => {},
    invitationData: null,
  };

  const InvitationContext = createContext<InvitationContextType>(defaultInvitationContextValue);

export const useInvitation = () => useContext(InvitationContext);

export { InvitationContext };

interface InvitationProviderProps {
    children: ReactNode;
  }

  export const InvitationProvider: React.FC<InvitationProviderProps> = ({ children }) => {
    const { session } = useSession();
    const userID = session;
    const [invitationQueue, setInvitationQueue] = useState<any[]>([]);
    const [invitationData, setInvitationData] = useState(null);

    const openNextInvitation = () => {
        if (invitationQueue.length > 0) {
          const nextInvitation = invitationQueue[0];
          setInvitationData(nextInvitation); 
          router.push("/modals/showSharedRecipeInvitation");
        }
      };

    const processNextInvitation = () => {
        if (invitationQueue.length > 0) {
        setInvitationQueue((prevQueue) => prevQueue.slice(1)); 
        openNextInvitation();
        } else {
            router.back();
        }
      };

      useEffect(() => {
        if (userID) {
          const q = query(collection(db, "invitations"), where("receiverId", "==", userID), where("status", "==", "pending"));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newInvitations = [];
            querySnapshot.forEach((doc) => {
              const invitationData = doc.data();
              newInvitations.push({ id: doc.id, ...invitationData });
            });
      
            setInvitationQueue(prevQueue => {
              // Überprüfen, ob neue Einladungen hinzugefügt wurden und die Queue leer war
              const shouldOpenNextInvitation = prevQueue.length === 0 && newInvitations.length > 0;
              const updatedQueue = [...prevQueue, ...newInvitations];
      
              // Wenn die Queue leer war und neue Einladungen hinzugefügt wurden
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