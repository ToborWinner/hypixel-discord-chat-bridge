const config = require("../../Configuration.js");
// const { ImgurClient } = require("imgur");

// const imgurClient = new ImgurClient({
//   clientId: config.minecraft.API.imgurAPIkey
// });

/**
 * Uploads image to Discord channel
 * @param {Buffer<ArrayBufferLike>} image
 */
async function uploadImage(image) {
  // const response = await imgurClient.upload({
  //  image: image
  // });
  // if (response.success === false) {
  //    throw "An error occured while uploading the image. Please try again later.";
  // }
  // return response;

  try {
    // ABSOLUTELY NOT, why in the world is this here?? Fetching any link a user sends???
    // Removed the code here for safety, but I removed the call to this function as well.
 
    // /** @type {import('discord.js').Client} */
    // // @ts-ignore
    // await client.channels.cache.get(config.discord.channels.guildChatChannel).send({
    //   files: [image]
    // });

    console.log("Image uploaded to Discord channel.");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadImage };
