const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

/**
 * Read file in async way
 * @param directory
 * @return {Promise}
 * */
const readFileAsync = (directory) => {
    return new Promise((resolve, reject) => {
        fs.readFile(directory, 'utf-8', (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
};

/**
 * Read files in a folder
 * @param directory
 * @return {Promise}
 * */
const readFilesInFolderInAsync = (directory) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
};

/**
 * Delete directory
 * @param directory
 * @param hasDeleteFilesInside
 * @return {Promise}
 * */
const deleteDirectoryInAsync = (directory, hasDeleteFilesInside = true) => {
    return new Promise((resolve, reject) => {
        fs.rm(directory, {recursive: hasDeleteFilesInside}, (err) => {
            if(err) return reject(err);
            resolve(directory);
        });
    });
};

/**
 * Crop image
 * @param {Object} inputOptions
 * @return {Promise}
 * */
const cropImage = (inputOptions) => {
    const defaultOptions = {
        imageSource: '',
        imageDestination: '',
        scale: 'small',
        imageOutputName: '',
        imageFileExtension: ''
    };
    const options = {...defaultOptions, ...inputOptions};
    const imageWidth = options.scale === 'small' ? 400 : 500;

    // crop image
    return sharp(options.imageSource)
        .resize(imageWidth)
        .toFile(path.join(options.imageDestination, options.imageOutputName + '-' + options.scale + '.' + options.imageFileExtension))
};

module.exports = {
    readFilesInFolderInAsync,
    readFileAsync,
    deleteDirectoryInAsync,
    cropImage
};