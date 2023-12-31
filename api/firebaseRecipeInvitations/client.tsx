import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useSession } from '../../api/firebaseAuthentication/client';
import { db } from '../../FirebaseConfig'
import { router } from 'expo-router';

interface InvitationContextType {
    invitationData: any; 
    openInvitationModal: (invitation: any) => void; 
  }

  const defaultInvitationContextValue: InvitationContextType = {
    invitationData: null,
    openInvitationModal: () => {},
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
    const [invitationData, setInvitationData] = useState(null);

    const openInvitationModal = (invitation: any) => {
        setInvitationData(invitation);
        router.push("/modals/showSharedRecipeInvitation");
    };

    

    useEffect(() => {
        console.log("useEffect in InvitationProvider ausgelöst, userID:", userID);
        if (userID) {
            const q = query(collection(db, "invitations"), where("receiverId", "==", userID), where("status", "==", "pending"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const invitations: any[] = [];
                querySnapshot.forEach((doc) => {
                    const invitationData = doc.data();
                    invitations.push({ id: doc.id, ...invitationData });
                });

                invitations.forEach((invitation) => {
                    openInvitationModal(invitation);
                });
            });

            return () => unsubscribe();
        }
    }, [userID]);

    return (
        <InvitationContext.Provider value={{ invitationData, openInvitationModal }}>
            {children}
        </InvitationContext.Provider>
    );
};