const Contact = require("../models/contact");

class ContactController {
    
    // create contact form
    static createContact = async (req, res) => {
        const {name,email,subject,message} = req.body;
        try{
            if(!name || !email || !subject || !message){
                return res.status(400).json({message:"All fields are required"});
            }

            const contact = new Contact({
                name,
                email,
                subject,
                message
            });

            await contact.save();
            res.status(201).json({message:"Contact created successfully",contact});
        }
        catch(error){
            console.log(error);
            res.status(500).json({message:"Internal server error"});
        }
    }

    // get all contact form
    static getAllContact = async (req, res) => {
        try{
            const contacts = await Contact.find();
            res.status(200).json({message:"Contacts fetched successfully",contacts});
        }
        catch(error){
            console.log(error);
            res.status(500).json({message:"Internal server error"});
        }
    }
}

module.exports = ContactController;