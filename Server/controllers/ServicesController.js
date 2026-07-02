const Service = require('../models/services');

class ServicesController {

    // CREATE SERVICE
    static createService = async (req, res) => {
        try {
            let { title, description, headTitle, headDescription } = req.body;

            if (!title || !description || !headTitle || !headDescription) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            // अगर फ्रंटएंड से headTitle स्ट्रिंग के रूप में आ रहा है, तो उसे कॉमा से तोड़कर असली एरे बनाएं
            if (headTitle && typeof headTitle === 'string') {
                headTitle = headTitle.split(',').map(s => s.trim()).filter(Boolean);
            } else if (Array.isArray(headTitle) && headTitle.length === 1 && headTitle[0].includes(',')) {
                // यह उस कंडीशन को हैंडल करेगा जहाँ एरे के अंदर एक सिंगल लंबी स्ट्रिंग आ रही हो
                headTitle = headTitle[0].split(',').map(s => s.trim()).filter(Boolean);
            }

            // अगर फ्रंटएंड से headDescription स्ट्रिंग के रूप में आ रही है
            if (headDescription && typeof headDescription === 'string') {
                headDescription = headDescription.split(',').map(d => d.trim()).filter(Boolean);
            } else if (Array.isArray(headDescription) && headDescription.length === 1 && headDescription[0].includes(',')) {
                headDescription = headDescription[0].split(',').map(d => d.trim()).filter(Boolean);
            }

            const service = await Service.create({
                title,
                description,
                headTitle: headTitle || [],
                headDescription: headDescription || []
            });

            res.status(201).json({
                success: true,
                message: "Service created successfully",
                service
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    }

    // GET ALL SERVICES
    static getAllServices = async (req, res) => {
        try {
            const services = await Service.find();
            res.status(200).json({
                success: true,
                message: "Services fetched successfully",
                services
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    }

    // GET SERVICE FOR FRONTEND
    static getService = async (req, res) => {
        try {
            const service = await Service.findOne();
            res.status(200).json({
                success: true,
                service
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    }


    // GET SINGLE SERVICE
    static getSingleService = async (req, res) => {
        try {
            const { id } = req.params;
            const service = await Service.findById(id);

            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Service fetched successfully",
                service
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    }

    // UPDATE SERVICE
    static updateService = async (req, res) => {
        try {
            const { id } = req.params;
            let { title, description, headTitle, headDescription } = req.body;

            const service = await Service.findById(id);

            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found"
                });
            }

            // अपडेट करते समय भी स्ट्रिंग को एरे में कन्वर्ट करने का सेफ़ चेक
            if (headTitle && typeof headTitle === 'string') {
                headTitle = headTitle.split(',').map(s => s.trim()).filter(Boolean);
            } else if (Array.isArray(headTitle) && headTitle.length === 1 && headTitle[0].includes(',')) {
                headTitle = headTitle[0].split(',').map(s => s.trim()).filter(Boolean);
            }

            if (headDescription && typeof headDescription === 'string') {
                headDescription = headDescription.split(',').map(d => d.trim()).filter(Boolean);
            } else if (Array.isArray(headDescription) && headDescription.length === 1 && headDescription[0].includes(',')) {
                headDescription = headDescription[0].split(',').map(d => d.trim()).filter(Boolean);
            }

            // Update fields
            service.title = title || service.title;
            service.description = description || service.description;
            service.headTitle = headTitle || service.headTitle;
            service.headDescription = headDescription || service.headDescription;

            await service.save();

            res.status(200).json({
                success: true,
                message: "Service updated successfully",
                service
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    }

    // DELETE SERVICE
    static deleteService = async (req, res) => {
        try {
            const { id } = req.params;

            const service = await Service.findById(id);

            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found"
                });
            }

            await Service.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: "Service deleted successfully"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    }
}

module.exports = ServicesController;