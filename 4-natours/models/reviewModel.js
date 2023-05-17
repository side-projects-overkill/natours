// review rating createdAt ref to tour user ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Must have a user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  // .populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  next();
});

reviewSchema.index(
  {
    tour: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // Here this refers the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', (doc) =>
  doc.constructor.calcAverageRatings(doc.tour)
);

// The following code can be commented because mongoose 7 has the current doc as a argument
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   /**
//   In the first scenario: await this.clone().findOne();
//     Calling clone() before findOne() captures any middleware attached to the query object.
//     The retrieved document stored in this.r (using the cloned query object) still triggers any attached middleware in the post middleware function.

//   In the second scenario:await this.findOne().clone();
//     Calling clone() after findOne() does not capture any middleware attached to the query object.
//     The cloned document stored in this.r does not trigger any middleware in the post middleware function.
//     In summary, the order of operations affects whether the middleware attached to the query object is captured and executed later on or not.
//    */
//   this.r = await this.clone().findOne();
//   next();
// });

reviewSchema.post(/^findOneAnd/, (doc) =>
  // await this.findOne(); does NOT work here, query has already executed
  doc.constructor.calcAverageRatings(doc.tour)
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
