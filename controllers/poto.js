const express = require('express');
const {ValidationError} = require('sequelize');

const router = express.Router();
const responseUtil = require('../helpers/response');

const { Photo, User, Comment } = require('../models');


const createPhoto = (req, res) => {
    try {
        const {title, caption, poster_image_url} = req.body;
        const {id} = req.user;
        Photo.create({title, caption, poster_image_url, user_id: id})
            .then((data) => {
                responseUtil.successResponse(
                    res,
                    null,
                    {id: data.id, poster_image_url, title, caption, userId: id},
                    201,
                );
            }).catch(err => {
                if (err instanceof ValidationError)
                    return responseUtil.validationErrorResponse(res, err.errors[0]);
                else
                    return responseUtil.badRequestResponse(res, err);
            })
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const getPhoto = (req, res) => {
    try {
       Photo.findAll({
           include: [
               {
                   model: User,
                   attributes: ['id', 'username', 'profile_image_url']
               },
               {
                   model: Comment,
                   attributes: ['comment'],
                   include: {
                       model: User,
                       attributes: ['username']
                   }
               }
               ]
       })
            .then((data) => {
                return responseUtil.successResponse(res, null, {photos: data})
            })
            .catch(err => {
                return responseUtil.badRequestResponse(res, err);
            })
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const updatePhoto = (req, res) => {
    try {
        const {title,caption,poster_image_url} = req.body;
        const bodyData = {title,caption,poster_image_url};
        const id = parseInt(req.params.photoId);
        Photo.update(bodyData, {where: {id}, returning: true})
            .then((data) => {
                if (data[0] === 0){
                    return responseUtil.badRequestResponse(res, {message: 'data not found'});
                }
                return responseUtil.successResponse(res, null, {photo: data[1][0]});
            })
            .catch(err => {
                if (err instanceof ValidationError)
                    return responseUtil.validationErrorResponse(res, err.errors[0]);
                return responseUtil.badRequestResponse(res, err);
            })
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

const deletePoto = (req, res) => {
    try {
        const id = parseInt(req.params.photoId);
        Photo.destroy({where: {id}})
            .then(result => {
                if (result === 0) {
                    return responseUtil.badRequestResponse(res, {message: 'photo not found'});
                }
                return responseUtil.successResponse(res, 'Your photo has been successfully deleted')
            })
            .catch(err => {
                return responseUtil.badRequestResponse(res, err);
            })
    } catch (e) {
        return responseUtil.serverErrorResponse(res, {message: e.message});
    }
}

router.post('/', createPhoto);
router.get('/', getPhoto)
router.put('/:photoId', updatePhoto);
router.delete('/:photoId', deletePoto);

module.exports = router;
