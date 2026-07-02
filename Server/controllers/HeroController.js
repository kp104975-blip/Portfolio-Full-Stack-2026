const Hero = require("../models/Hero");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class HeroController {
    static createHero = async (req, res) => {
        try {
            const { subtitle, name, description, resumeLink, github, linkedin, instagram, frontendTitle, backendTitle } = req.body;
            if (!subtitle || !name || !description || !resumeLink || !github || !linkedin || !instagram || !frontendTitle || !backendTitle) {
                return res.status(400).json({
                    message: "All fields are required",
                })
            }
            const isHeroExists = await Hero.findOne();
            if (isHeroExists) {
                return res.status(400).json({
                    message: "Hero already exists",
                })
            }
            if (!req.files || !req.files.profileImage) {
                return res.status(400).json({
                    success: false,
                    message: "Profile image is required",
                })
            }
            const profileImage = req.files.profileImage;
            console.log(profileImage)

            const uploadResult = await cloudinary.uploader.upload(profileImage.tempFilePath, {
                folder: "porfolio_hero",
                resource_type: "image"
            });
            console.log(uploadResult)

            fs.unlinkSync(profileImage.tempFilePath);

            const result = await Hero.create({
                subtitle,
                name,
                description,
                profileImage: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                resumeLink,
                github,
                linkedin,
                instagram,
                frontendTitle,
                backendTitle
            });

            res.status(200).json({
                success:true,
                message:"Hero created successfully",
                data:result
            })

        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // get all hero
    static getAllHero = async (req, res) => {
        try {
            const hero = await Hero.findOne();
            res.status(200).json({
                success: true,
                hero,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    };

    // single hero  
    static getSingleHero = async (req, res) => {
        try {
            const { id } = req.params
            const hero = await Hero.findById(id)

            if (!hero) {
                return res.status(404).json({
                    success: false,
                    message: 'Hero not found'
                })
            }

            res.json({
                success: true,
                message: 'Hero fetched successfully',
                hero
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    static deleteHero = async (req, res) => {
        try {
            const { id } = req.params
            const hero = await Hero.findById(id)

            if (!hero) {
                return res.status(404).json({
                    success: false,
                    message: 'Hero not found'
                })
            }

            await cloudinary.uploader.destroy(hero.public_id)
            await hero.deleteOne()

            res.json({
                success: true,
                message: 'Hero deleted successfully'
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // update hero
    static updateHero = async (req, res) => {
        try {
            const {
                subtitle,
                name,
                description,
                resumeLink,
                github,
                linkedin,
                instagram,
                frontendTitle,
                backendTitle
            } = req.body

            const { id } = req.params

            // Find hero
            const hero = await Hero.findById(id)

            if (!hero) {
                return res.status(404).json({
                    success: false,
                    message: 'Hero not found'
                })
            }

            // ===============================
            // IMAGE UPDATE
            // ===============================
            if (req.files && req.files.profileImage) {

                // Delete old image from Cloudinary
                if (hero.public_id) {
                    await cloudinary.uploader.destroy(hero.public_id)
                }

                const file = req.files.profileImage

                // Upload new image
                const uploadResult = await cloudinary.uploader.upload(
                    file.tempFilePath,
                    {
                        folder: 'portfolio_hero',
                        resource_type: 'image'
                    }
                )

                // Remove temp file
                fs.unlinkSync(file.tempFilePath)

                // Save new image
                hero.profileImage = uploadResult.secure_url
                hero.public_id = uploadResult.public_id
            }

            // ===============================
            // TEXT FIELD UPDATE
            // ===============================
            hero.subtitle = subtitle
            hero.name = name
            hero.description = description
            hero.resumeLink = resumeLink
            hero.github = github
            hero.linkedin = linkedin
            hero.instagram = instagram
            hero.frontendTitle = frontendTitle
            hero.backendTitle = backendTitle

            // Save all updates
            await hero.save()

            res.status(200).json({
                success: true,
                message: 'Hero section updated successfully',
                hero
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = HeroController;


