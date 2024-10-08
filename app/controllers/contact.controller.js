
const MongoDB = require('../utils/mongodb.util');
const ContactService = require('../service/contact.service');
const ApiError = require('../api-error');

exports.create = async (req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(400, 'Name cannot be empty'));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, 'an error occurred while creating the contact')
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;

        if(name) {
            documents = await contactService.findByName(name);
        }
        else {
            documents = await contactService.find({});
        }
    }
    catch (error) {
        return next(
            new ApiError(500, 'an error occurred while retrieving contacts')
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);    
        const document = await contactService.findByID(req.params.id);
        if(!document) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send(document);
    } 
    catch (error) {
        return next(
            new ApiError(500, `Error retrieving contact with id = ${req.params.id}`)
        );
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);       
        const ducuments = await contactService.findFavorite();
        return res.send(ducuments);
    } 
    catch (error) {
        return next(
            new ApiError(500, 'An error occurred while retrieving favorite contacts')
        );     
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0) {
        return next(
            new ApiError(400, 'Data to update cannot be empty')
        );
    }

    try {
        const contactService = new ContactService(MongoDB.client);       
        const document = await contactService.update(req.params.id, req.body);
        if(!document) {
            return next(404, 'Contact not found');
        }
        return res.send({
            message: 'Contact was updated successfully',
        });
    } 
    catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id = ${req.params.id}`)
        );     
    }

};

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);       
        const document = await contactService.delete(req.params.id);
        if(!document) {
            return next(404, 'Contact not found');
        }
        return res.send({
            message: 'Contact was deleted successfully',
        });
    } 
    catch (error) {
        return next(
            new ApiError(500, `Counld not delete contact with id = ${req.params.id}`)
        );     
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);       
        const deleteCount = await contactService.deleteAll();
        return res.send({
            message: `${deleteCount} contacts were deleted successfully`,
        });
    } 
    catch (error) {
        return next(
            new ApiError(500, 'An error occurred while removing all contacts')
        );     
    }
};
