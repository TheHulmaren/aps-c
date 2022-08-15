const { getDb, ObjectId } = require("../lib/db/db");
const Lens = require("../models/Lens");
const { getPresignedUrl } = require("../lib/bucket/bucket");
const SamplePhoto = require("../models/Samplephoto");
const Article = require("../models/Article");

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).send({ message: "401 - Unauthorized" });
  }
}

function queryLenses(req, res, next) {
  var aMin = parseFloat(req.query?.apertureMin ? req.query.apertureMin : 0);
  var aMax = parseFloat(req.query?.apertureMax ? req.query.apertureMax : 10000);
  var fMin = parseFloat(req.query?.focusMin ? req.query.focusMin : 0);
  var fMax = parseFloat(req.query?.focusMax ? req.query.focusMax : 10000);
  var query = {
    $and: [
      {
        $and: [
          { "aperture.min": { $lte: aMax } },
          { "aperture.max": { $gte: aMin } },
        ],
      },
      {
        $and: [
          { "focus.min": { $lte: fMax } },
          { "focus.max": { $gte: fMin } },
        ],
      },
    ],
  };

  if (req.query.maker) {
    query.maker = req.query.maker;
  }

  var lens = new Lens();
  lens
    .find(query)
    .then((result) => {
      res.locals.query = req.query;
      res.locals.lenses = result;
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Failed to load lens data" });
    });
}

function getLensEditDetail(req, res, next) {
  var lens = new Lens();
  lens
    .getLensByLid(req.params.id)
    .then((result) => {
      res.locals.lens = result;
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to load lens to edit" });
    });
}

function getLensDetail(req, res, next) {
  var lens = new Lens();
  lens
    .getLensByLid(req.params.id)
    .then((result) => {
      res.locals.lens = result;
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to load lens detail" });
    });
}

function editLensInfo(req, res, next) {
  var lensInfo = {
    maker: req.body.maker,
    name: req.body.name,
    "aperture.min": parseFloat(req.body.apertureMin),
    "aperture.max": parseFloat(req.body.apertureMax),
    "focus.min": parseFloat(req.body.focusRangeMin),
    "focus.max": parseFloat(req.body.focusRangeMax),
  };

  var lens = new Lens();
  lens
    .updateLensById(req.body.lid, lensInfo)
    .then((result) => {
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to update lens data" });
    });
}

function addNewLens(req, res, next) {
  var lensData = {
    maker: req.body.maker,
    name: req.body.name,
    aperture: {
      min: parseFloat(req.body.apertureMin),
      max: parseFloat(req.body.apertureMax),
    },
    focus: {
      min: parseFloat(req.body.focusRangeMin),
      max: parseFloat(req.body.focusRangeMax),
    },
  };

  var lens = new Lens();

  lens
    .addLens(lensData)
    .then((result) => {
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to add lenses" });
    });
}

function articlePagination(req, res, next) {
  var lid = ObjectId(req.params.id);

  var nPerPage = 8;
  var buttonsInLine = 5;

  var pageIndex = parseInt(req.query?.pageIndex ?? 1);
  var buttonStart = Math.floor((pageIndex - 1) / buttonsInLine) * buttonsInLine;
  var displayedButtonsCount = buttonsInLine;

  getDb()
    .collection("article")
    .find({ lens: lid })
    .sort({ _id: -1 })
    .skip((pageIndex - 1) * nPerPage)
    .limit(nPerPage)
    .toArray((err, result) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Failed to load articles in range" });

      res.locals.articles = result;
      res.locals.pageIndex = pageIndex;
      res.locals.buttonsInLine = buttonsInLine;
      res.locals.buttonStart = buttonStart;
      res.locals.displayedButtonsCount = displayedButtonsCount;
      next();
    });
}

function addNewArticle(req, res, next) {
  var lid = ObjectId(req.body.lid);
  var insertData = {
    lens: lid,
    poster: req.user?.id ?? "Anonymous",
    text: req.body.text,
    date: new Date(),
  };

  var article = new Article();
  article
    .addArticle(insertData)
    .then((result) => {
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to add new article" });
    });
}

function sideBarSamplePhotos(req, res, next) {
  var samplephoto = new SamplePhoto();

  var lid = ObjectId(req.params.id);

  samplephoto
    .findSamplePhotosByLens(req.params.id)
    .then((result) => {
      var samplephotos = samplephoto.getPresignedUrls(result);

      res.locals.samplephotos = samplephotos;
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: "Failed to load sidebar sample photos" });
    });
}

function addNewSamplePhoto(req, res, next) {
  var lid = ObjectId(req.body.lid);

  var base64data = new Buffer.from(req.file.buffer, "binary");
  var samplephoto = new SamplePhoto();

  samplephoto
    .uploadSamplePhoto(base64data)
    .then((result) => {
      var additionalData = {
        lens: lid,
        date: new Date(),
        uploader: req.user.id,
        description: req.body.description,
      };
      var insertData = { ...result, ...additionalData };

      return samplephoto.addSamplePhotoInfo(insertData);
    })
    .then((result) => {
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Failed to upload new image" });
    });
}

function getLensSamplePhotos(req, res, next) {
  var samplephoto = new SamplePhoto();

  samplephoto
    .findSamplePhotosByLens(req.params.id)
    .then((result) => {
      var samplephotos = samplephoto.getPresignedUrls(result);

      res.locals.samplephotos = samplephotos;
      next();
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Failed to load sample photos for the lens" });
    });
}

function samplePhotoSlide(req, res, next) {
  var samplephoto = new SamplePhoto();
  var lens = new Lens();

  samplephoto
    .getSamplePhotoById(req.params.pid)
    .then((result) => {
      var resultWithUrl = samplephoto.getPresignedUrls([result])[0];

      res.locals.samplephoto = resultWithUrl;

      return lens.getLensByLid(result.lens.toString());
    })
    .then((result) => {
      res.locals.lens = result;

      return samplephoto.findNearbyPhotosById(
        req.params.pid,
        result._id.toString(),
        2
      );
    })
    .then((result) => {
      var photosWithUrl = samplephoto.getPresignedUrls(result);
      res.locals.nearby = photosWithUrl;

      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Failed to load sample photo slide" });
    });
}

module.exports = {
  isLoggedIn,
  queryLenses,
  articlePagination,
  sideBarSamplePhotos,
  getLensEditDetail,
  getLensDetail,
  editLensInfo,
  addNewLens,
  addNewArticle,
  addNewSamplePhoto,
  getLensSamplePhotos,
  samplePhotoSlide,
};
