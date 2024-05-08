const axios =  require('axios')

const sendSMS_Registraion = async(to) => {
    try{
        
        
         const message ="Congratulations! You have successfully registered to LearnLoom!";

        const response = await axios.post('http://localhost:3004/api/sms/sendSMS',{
            to,
            message
        });

        return response.data;

    } catch(error){
        console.log(error)
        throw error.response.data

    }
}

module.exports = {sendSMS_Registraion}