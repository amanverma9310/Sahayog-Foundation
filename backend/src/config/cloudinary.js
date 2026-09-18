// cloudinary is published as CommonJS; a named `import { v2 } from 'cloudinary'`
// depends on Node's static analysis of the package's exports and is not
// reliable across versions/bundlers. Importing the default export and
// reading `.v2` off it works unconditionally.
import cloudinaryPkg from 'cloudinary'

const cloudinary = cloudinaryPkg.v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
