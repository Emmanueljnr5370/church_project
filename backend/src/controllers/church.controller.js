const Church = require('../models/church.model');
const Project = require('../models/project.model');
const Transaction = require('../models/transaction.model');
const mongoose = require('mongoose');

module.exports = {
    async createChurch(req, res) {
        try {

            const { churchName, churchAddress, photoUrl } = req.body;

            const church = await Church.findOne({ churchName: churchName });

            if (church != null) {
                return res.status(401).json({ error: 'Church already existing' });
            }


            const newChurch = await Church.create({
                churchName: churchName,
                churchAddress: churchAddress,
                photoUrl: photoUrl,
                status: true
            });

            res.status(200).json({ message: 'Church created', church: newChurch });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async updateChurch(req, res) {
        try {
            const { churchId, churchName, churchAddress, churchImage, status } = req.body;

            const updateChurch = await Church.findByIdAndUpdate(churchId, {
                churchName: churchName,
                churchAddress: churchAddress,
                photoUrl: churchImage,
                status: status
            });

            if (!updateChurch) {
                return { success: false, message: 'This church is not found' };
            }

            const church = await Church.findById(churchId);
            const project = await Project.find({ churchId: churchId });

            res.status(200).json({ message: 'Church updated', church: church, project: project });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async allChurch(req, res) {
        try {

            const churches = await Church.aggregate([
                {
                    $lookup: {
                        from: 'transactions',
                        localField: '_id',
                        foreignField: 'churchId',
                        as: 'transactions'
                    }
                },
                {
                    $unwind: {
                        path: '$transactions',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        churchName: { $first: '$churchName' },
                        churchAddress: { $first: '$churchAddress' },
                        photoUrl: { $first: '$photoUrl' },
                        status: { $first: '$status' },
                        totalAmount: {
                            $sum: {
                              $convert: {
                                input: '$transactions.amount',
                                to: 'double',
                                onError: 0,
                                onNull: 0
                              }
                            }
                        }
                    }
                }
            ]);

            res.status(200).json({ message: 'Church List', church: churches });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async searchChurch(req, res) {
        try {
            const { keyword, sort } = req.body;

            let _sort;
            if (sort == true) {
                _sort = 1;
            }
            else {
                _sort = -1;
            }

            const churches = await Church.find({ $or: [{ churchName: { $regex: new RegExp(keyword, 'i') } }, { churchAddress: { $regex: new RegExp(keyword, 'i') } }] }).sort({ churchName: _sort });
            console.log(churches)

            res.status(200).json({ message: 'Church searched', church: churches });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async deleteChurch(req, res) {
        try {

            const churchId = req.params.id;

            const church = await Church.findByIdAndDelete(churchId);


            res.status(200).json({ message: 'Church deleted', project: { churchName: church.churchName, projectData: church } });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async churchDetail(req, res) {
        try {

            const churchId = req.params.id;

            const church = await Church.findById(churchId);

            const projects = await Project.find({ churchId: churchId });

            res.status(200).json({ message: 'Succeed', church: church, projects: projects });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async projectDetail(req, res) {
        try {

            const projectId = req.params.id;

            const project = await Project.findById(projectId);
            const church = await Church.findById(project._id)

            res.status(200).json({ message: 'Succeed', project: { churchName: church.churchName, projectData: project } });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async deleteProject(req, res) {
        try {

            const churchId = req.params.cid;
            const projectId = req.params.id;

            const project = await Project.findByIdAndDelete(projectId);


            res.status(200).json({ message: 'Project deleted', project: { churchName: church.churchName, projectData: church } });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async updateProject(req, res) {
        try {
            const { projectId, projectData } = req.body;

            const project = await Project.findById(projectId);

            if (!project) {
                return { success: false, message: 'This project is not found' };
            }

            const updateData = {
                projectName: projectData[0].projectName,
                projectDescription: projectData[0].projectDescription,
                projectPhoto: projectData[0].projectPhoto
            }

            const updateProject = await Project.findByIdAndUpdate(projectId, updateData);

            res.status(200).json({ message: 'Project updated', church: updateProject });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async createProject(req, res) {
        try {
            const { churchId, projectList } = req.body;

            const church = await Church.findById(churchId);

            if (!church) {
                return { success: false, message: 'Church not found' };
            }

            const newProject = await Project.create({
                churchId: churchId,
                projectName: projectList[0].projectName,
                projectPhoto: projectList[0].projectPhoto,
                projectDescription: projectList[0].projectDescription,
            });

            const nChurch = await Church.findById(churchId);

            res.status(200).json({ message: 'Project created', church: nChurch });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
    },
    async adminGetChurchList (req, res) {
        try {
          const {church} = req.body;
          const churchIds = church.map(item => item.value);
    
          const churches = await Church.aggregate([
            {
              $match: {
                '_id': { $in: churchIds.map(value => new mongoose.Types.ObjectId(value)) }
              }
            },
            {
              $lookup: {
                from: 'transactions',
                localField: '_id',
                foreignField: 'churchId',
                as: 'transactions'
              }
            },
            {
              $unwind: {
                path: '$transactions',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $group: {
                _id: '$_id',
                churchName: { $first: '$churchName' },
                churchAddress: { $first: '$churchAddress' },
                photoUrl: { $first: '$photoUrl' },
                status: { $first: '$status' },
                totalAmount: {
                  $sum: {
                    $convert: {
                      input: '$transactions.amount',
                      to: 'double',
                      onError: 0,
                      onNull: 0
                    }
                  }
                }
              }
            }
          ]);
          console.log(churches)
    
          res.status(200).json({ message: 'Church List', church: churches});
        } catch (error) {
          res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
        }
      }
};