const { ApplicationError } = require('@util/customErrors')
const { isAdmin } = require('@util/common')
const models = require('@db/models')

const create = async (req, res) => {
  const { username } = req.currentUser
  const { courseName } = req.params

  const user = await models.User.findOne({ username })
  const courseInfo = await models.Course.findOne({ name: courseName })
  if (!courseInfo) throw new ApplicationError('Course not found', 404)

  const sub = new models.Submission({
    week: req.body.week !== undefined ? req.body.week : courseInfo.week,
    exercises: req.body.exercises,
    user: user._id,
    time: req.body.hours,
    comment: req.body.comments,
    github: req.body.github,
    username,
    course: courseInfo._id,
    courseName: courseInfo.name,
  })

  await sub.save()

  user.submissions.push(sub._id)
  await user.save()

  await user.populate('submissions').execPopulate()

  res.send(user)
}

const weekly = async (req, res) => {
  const week = Number(req.params.week)
  const { username } = req.currentUser
  const { courseName } = req.params

  if (!isAdmin(username, courseName)) throw new ApplicationError('Not authorized', 403)

  const all = await models.Submission.find({ week, courseName }).populate('user').exec()

  const format = s => ({
    student: {
      username: s.user.username,
      student_number: s.user.student_number,
      first_names: s.user.first_names,
      last_name: s.user.last_name,
    },
    hours: s.time,
    exercise_count: s.exercises.length,
    marked: s.exercises,
    github: s.github,
    comment: s.comment,
  })

  const formattedSubmissions = all.map(format)

  res.send(formattedSubmissions)
}

const update = async (req, res) => {
  return res.send(501)
  /*
  const { courseName, studentNumber, week }

  const time, exers, github

  const user = await models
    .User
    .findOne({ student_number })
    .populate('submissions')

  const exercises = exers.split(',').map(s => Number(s))

  const sub = new models.Submission({
    week,
    exercises,
    time,
    github,
    user: user._id,
    comment: '',
    username: user.username,
    courseName,
  })

  await sub.save()

  user.submissions.push(sub._id)
  await user.save()

  res.send(200)
  */
}

module.exports = {
  create,
  weekly,
  update,
}
