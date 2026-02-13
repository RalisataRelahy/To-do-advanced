import {getAuth,sendPasswordResetEmail} from "firebase/auth"

const auth=getAuth();
export const resetPassword=async(email:string)=>{
    try{
        await sendPasswordResetEmail(auth,email);
        return "Email de reinisialisation envoye!"
    }catch(error){
        throw error;
    }
}