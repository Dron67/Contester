const errorHandler = require('../utils/ErrorHandler')
const Tasks = require('../models/Task')
const Solve = require('../models/Solve')
const Competition = require('../models/Competition')
const User = require('../models/User')
const {formatDate} = require("@angular/common");

module.exports.fetchTable = async function (req, res) {
    var table = {}
    try {
        const competition = await Competition.findOne({_id: req.params.id})
        console.log(competition)
        const tasks = await Tasks.find({competition: competition._id})
        for (let task of tasks) {
            const solves = await Solve.find({
                task: task._id, date: {
                    $gte: competition.timeStart,
                    $lte: competition["timeEnd"]
                }
            })
            for (let solve of solves) {
                if (table[solve.user]) {
                    if (!table[solve.user][task._id]) {
                        table[solve.user][task._id] = {}
                        table[solve.user][task._id].isAccept = false
                        table[solve.user][task._id].col_solve = 0;
                    }
                    if (table[solve.user][task._id].isAccept) {
                        continue
                    }
                    var time = Math.floor((new Date(solve.date) - new Date(competition.timeStart)) / 1000.0 / 60.0)
                    var min = time
                    var hour = Math.floor(min / 60.0)
                    min = min % 60
                    table[solve.user][task._id].posl_time = `${hour < 10 ? '0' + hour.toString() : hour}:${min < 10 ? '0' +
                        min.toString() : min}`
                    if (solve.result === "Accept") {
                        table[solve.user].time += time
                        table[solve.user][task._id].isAccept = true
                        table[solve.user].ball =table[solve.user].ball  - 1000000 + (time + table[solve.user][task._id].col_solve * 20)
                        //table[solve.user].ball += time + table[solve.user][task._id].col_solve * 20;
                        table[solve.user].isAccept = true
                    } else {
                        table[solve.user][task._id].col_solve += 1;
                    }
                } else {
                    const user = await User.findOne({_id: solve.user});
                    table[solve.user] = {}
                    table[solve.user].fio = `${user.lastName} ${user.firstName} ${user.secondName}(${user.organization})`
                    table[solve.user][task._id] = {}
                    table[solve.user][task._id].isAccept = false
                    table[solve.user][task._id].col_solve = 0
                    table[solve.user].isAccept = false
                    var time = Math.floor((new Date(solve.date) - new Date(competition.timeStart)) / 1000.0 / 60.0)
                    var min = time
                    var hour = Math.floor(min / 60.0)
                    min = min % 60
                    table[solve.user][task._id].posl_time = `${hour < 10 ? '0' + hour.toString() : hour}:${min < 10 ? '0' +
                        min.toString() : min}`
                    table[solve.user].time = 0
                    if (solve.result === "Accept") {
                        table[solve.user].time = time
                        table[solve.user][task._id].isAccept = true
                        table[solve.user].ball = 10000000000000000+time-100000
                        //table[solve.user].ball = time
                        table[solve.user].isAccept = true
                    } else {
                        table[solve.user].ball = 10000000000000000
                        //table[solve.user].ball = 0
                        table[solve.user][task._id].col_solve += 1;
                    }
                }
            }
        }

        res.status(200).json(table);
    } catch (e) {
        errorHandler(res, e)
    }
}