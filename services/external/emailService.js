const axios =  require('axios')

const sendEmail_Registraion = async(email) => {
    try{
        
         const subject  = "User Registration";
         const message ="Congratulations! You have successfully registered to LearnLoom!";

        const response = await axios.post('http://localhost:3004/api/email/sendEmail',{
            email,
            subject,
            message
        });

        return response.data;

    } catch(error){
        console.log(error)
        throw error.response.data

    }
}

module.exports = {sendEmail_Registraion}