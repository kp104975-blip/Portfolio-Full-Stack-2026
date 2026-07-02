const skill = require("../models/skill");

class SkillController {
    // create skill
    static createSkill = async (req,res) => {
        try{
            const {name,percentage,icon} = req.body;
            if(!name || !percentage || !icon){
                return res.status(400).json({message:"All fields are required"});
            }
            const skill = new skill({
                name,
                percentage,
                icon
            });
            await skill.save();
            res.status(201).json({message:"Skill created successfully",skill});
        }
        catch(error){
            console.log(error);
            res.status(500).json({message:"Internal server error"});
        }
    }

    // get all skills
    static getAllSkill = async (req,res) => {
        try{
            const skills = await skill.find();
            res.status(200).json({message:"Skills fetched successfully",skills});
        }
        catch(error){
            console.log(error);
            res.status(500).json({message:"Internal server error"});
        }
    }

    // update skill
    static updateSkill = async (req,res) => {
        try{
            const {id} = req.params;
            const skill = await skill.findById(id);
            if(!skill){
                return res.status(404).json({message:"Skill not found"});
            }
            const updatedSkill = await skill.findByIdAndUpdate(id,req.body,{new:true});
            res.status(200).json({message:"Skill updated successfully",updatedSkill});
        }
        catch(error){
            console.log(error);
            res.status(500).json({message:"Internal server error"});
        }
    }

    // delete skill
    static deleteSkill = async (req,res) => {
        try{
            const {id} = req.params;
            const skill = await skill.findById(id);
            if(!skill){
                return res.status(404).json({message:"Skill not found"});
            }
            await skill.findByIdAndDelete(id);
            res.status(200).json({message:"Skill deleted successfully"});
        }
        catch(error){
            console.log(error);
            res.status(500).json({message:"Internal server error"});
        }
    }
}

module.exports = SkillController;
