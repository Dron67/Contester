const Solve = require('../models/Solve')
const Task = require('../models/Task')
const Settings = require('../models/Settings')
const Tests = require('../models/Test')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const sp = require('child_process').spawn
const pidusage = require('pidusage')
const errorHandler = require('../utils/ErrorHandler')
const fs = require('fs')
const moment = require('moment')

const queue = []
const okTask = []
var tekEl = {}

module.exports.create = async function (req, res) {
    var time = 0
    var memory = 0
    var fl = 1
    try {
        const date = moment().format('yyyy-MM-DD HH:mm:ss')
        const taskPriority = {
            task: req.body.task,
            user: req.body.user,
            code: req.body.code,
            language: req.body.language,
            date: date
        }
        queue.push(taskPriority);
        res.status(200).json(
            {
                task: req.body.task,
                user: req.body.user,
                code: req.body.code,
                language: req.body.language,
                date: date,
                message: 'Waiting'
            }
        )

        while (queue.length !== 0) {
            const tekElement = queue[0]
            queue.splice(0, 1);
            tekEl = tekElement

            const task = await Task.findOne({_id: tekElement.task}) //чекер
            const checkerLang = await Settings.findOne({name: task.language}) // язык чекера

            const language = await Settings.findOne({name: tekElement.language}) //язык попытки
            const tests = await Tests.find({task: tekElement.task}) //тесты

            const lang = language.commander.split(';')
            let s = task.checker
            console.log('CHECKER BLAT!!!')
            console.log(s)

            //while(1) {
                await fs.truncate(`./solve/checker-${checkerLang.file}`, (err) => {
                    if (err)
                        console.log(err)
                })
                //READFILE!
                // fs.readFile(`./solve/checker-${checkerLang.file}`,'r',(err)=>{
                //     if (err)
                //         console.log(err)
                //     fs.resu
                // })

            //
            //
            //     console.log('PUSTOTAA!!!!')
            //     console.log(st1)
            //     if(st1==='')
            //         break;
            // }


          //  while(1) {
                await fs.writeFile(`./solve/checker-${checkerLang.file}`, task.checker, (err) => {
                    if (err)
                        console.log(err)
                })
            //     let file = `./solve/checker-${checkerLang.file}`;
            //
            //     const reader = new FileReader();
            //     reader.readAsText(file.toBlob());
            //     if(reader.result===s)
            //         break;
            // }
            var checkerCommander = checkerLang.commander.replace('solve', 'checker-solve')
            checkerCommander = checkerCommander.replace('solve.out', 'checker-solve.out')
            checkerCommander = checkerCommander.replace('./solve.out', './checker-solve.out')
            console.log(checkerCommander)
            console.log(checkerLang.commander)

            await fs.truncate(`./solve/${language.file}`, (err) => {
                if (err)
                    console.log(err)
            })

            await fs.writeFile(`./solve/${language.file}`, tekElement.code, (err) => {
                if (err)
                    console.log(err)
            })
            var i = 1
            for (let test of tests) {
                await fs.truncate('./solve/input.txt', (err) => {
                    if (err)
                        console.log(err)
                })

                await fs.writeFile('./solve/input.txt', test.input, (err) => {
                    if (err)
                        console.log(err)
                })

                await fs.truncate('./solve/pattern.txt', (err) => {
                    if (err)
                        console.log(err)
                })

                await fs.writeFile('./solve/pattern.txt', test.pattern, (err) => {
                    if (err)
                        console.log(err)
                })

                await fs.truncate('./solve/output.txt', (err) => {
                    if (err)
                        console.log(err)
                })

                try {
                    if (lang.length > 1) { // компиляция с++ и тому подобных
                        const {stderr, stdout} = await exec(`${lang[0]}`, {cwd: './solve'})
                        if (stderr.toString()) {
                            await new Solve({
                                task: req.body.task,
                                user: req.body.user,
                                language: req.body.language,
                                code: req.body.code,
                                result: 'Compilation Error',
                                error: stderr.toString(),
                                date: date.toString(),
                                time: time,
                                memory: memory
                            }).save()
                            fl = 0
                            tekElement.message = 'OK'
                            okTask.push(tekElement)
                            tekEl = {}
                            break
                        }
                        const start = new Date().getTime()
                        try { // запуск с++ и тому подобных
                            const cp1 = await sp('sudo', ['chmod','777',`${lang[1]}`], {
                                cwd: './solve'
                            })


                            console.log('c++', lang[1])
                            const cp = await sp(`${lang[1]}`, ['<', 'input.txt', '>', 'output.txt'], {
                                timeout: task.limitTime + 100,
                                cwd: './solve'
                            })

                            const end1 = new Date().getTime()
                            await exec(`${lang[1]} < input.txt > output.txt`, {
                                timeout: task.limitTime + 100,
                                cwd: './solve'
                            })
                            time = end1 - start
                            const stats = await pidusage(cp.pid)
                            memory = stats.memory / 1024
                            if (stats.memory / 1024 > task.limitMemory) {
                                await new Solve({
                                    task: req.body.task,
                                    user: req.body.user,
                                    language: req.body.language,
                                    code: req.body.code,
                                    result: 'Memory Limit',
                                    error: 'Память превысила лимит',
                                    test: i,
                                    date: date.toString(),
                                    time: end1 - start,
                                    memory: stats.memory / 1024
                                }).save()
                                fl = 0
                                tekElement.message = 'OK'
                                okTask.push(tekElement)
                                tekEl = {}
                                break
                            }
                            if (end1 - start > task.limitTime) {
                                await new Solve({
                                    task: req.body.task,
                                    user: req.body.user,
                                    language: req.body.language,
                                    code: req.body.code,
                                    result: 'Time Limit',
                                    error: 'Время превысило лимит',
                                    test: i,
                                    date: date.toString(),
                                    time: end1 - start,
                                    memory: stats.memory / 1024
                                }).save()
                                fl = 0
                                tekElement.message = 'OK'
                                okTask.push(tekElement)
                                tekEl = {}
                                break
                            }
                        } catch (e) {
                            const end = new Date().getTime()
                            if (end - start > task.limitTime) {
                                await new Solve({
                                    task: req.body.task,
                                    user: req.body.user,
                                    language: req.body.language,
                                    code: req.body.code,
                                    result: 'Time Limit',
                                    error: 'Время превысило лимит',
                                    test: i,
                                    date: date.toString(),
                                    time: end - start,
                                    memory: memory
                                }).save()
                                fl = 0
                                tekElement.message = 'OK'
                                okTask.push(tekElement)
                                tekEl = {}
                            } else {
                                await new Solve({
                                    task: req.body.task,
                                    user: req.body.user,
                                    language: req.body.language,
                                    code: req.body.code,
                                    result: 'Compilation Error',
                                    error: e.message,
                                    date: date.toString(),
                                    time: end - start,
                                    memory: memory
                                }).save()
                                fl = 0
                                tekElement.message = 'OK'
                                okTask.push(tekElement)
                                tekEl = {}
                            }
                            console.log('error', e.message)
                            break
                        }
                    } else { //компиляция и запуск python и тому подобных
                        const py = language.commander.split(' ')
                        const cp2 = await sp('sudo', ['chmod','777',`${py[1]}`], {
                            cwd: './solve'
                        })
                        const start = new Date().getTime()


                        const cp = await sp(`${py[0]}`, [`${py[1]}`, '<', 'input.txt', '>', 'output.txt'],
                            {timeout: task.limitTime + 100, cwd: './solve'})
                        const end = new Date().getTime()
                        await exec(`${language.commander} < input.txt > output.txt`,
                            {timeout: task.limitTime + 100, cwd: './solve'})
                        const stats = await pidusage(cp.pid)
                        memory = stats.memory / 1024
                        time = end - start
                        if (memory > task.limitMemory) {
                             await new Solve({
                                task: req.body.task,
                                user: req.body.user,
                                language: req.body.language,
                                code: req.body.code,
                                result: 'Memory Limit',
                                error: 'Память превысила лимит',
                                test: i,
                                date: date.toString(),
                                time: time,
                                memory: memory
                            }).save()
                            fl = 0
                            tekElement.message = 'OK'
                            okTask.push(tekElement)
                            tekEl = {}
                            break
                        }
                        if (time > task.limitTime) {
                            await new Solve({
                                task: req.body.task,
                                user: req.body.user,
                                language: req.body.language,
                                code: req.body.code,
                                result: 'Time Limit',
                                error: 'Время превысило лимит',
                                test: i,
                                date: date.toString(),
                                time: time,
                                memory: memory
                            }).save()
                            fl = 0
                            tekElement.message = 'OK'
                            okTask.push(tekElement)
                            tekEl = {}
                            break
                        }
                    }
                } catch (e) {
                    console.log('error', e.message)
                    await new Solve({
                        task: req.body.task,
                        user: req.body.user,
                        language: req.body.language,
                        code: req.body.code,
                        result: 'Compilation Error',
                        error: e.message,
                        date: date.toString(),
                        time: time,
                        memory: memory
                    }).save()
                    fl = 0
                    tekElement.message = 'OK'
                    okTask.push(tekElement)
                    tekEl = {}
                    break
                }

                try { //checker
                    const {stderr, stdout} = await exec(`${checkerCommander}`, {cwd: './solve'})
                    if (stdout.toString() === "NO") {
                        await new Solve({
                            task: req.body.task,
                            user: req.body.user,
                            language: req.body.language,
                            code: req.body.code,
                            result: 'Wrong Answer',
                            test: i,
                            date: date.toString(),
                            time: time,
                            memory: memory
                        }).save()
                        fl = 0
                        tekElement.message = 'OK'
                        okTask.push(tekElement)
                        tekEl = {}
                        break
                    }
                } catch (e) {
                    console.log('error', e.message)
                    break
                }

                i += 1
            }
            if (fl === 1) {
                await new Solve({
                    task: req.body.task,
                    user: req.body.user,
                    language: req.body.language,
                    code: req.body.code,
                    result: 'Accept',
                    date: date.toString(),
                    time: time,
                    memory: memory
                }).save()
                tekElement.message = 'OK'
                okTask.push(tekElement)
                tekEl = {}
            }
        }
        tekEl = {}
    } catch (e) {
        errorHandler(res, e)
        return
    }
}

module.exports.getByTaskIdAndUserId = async function (req, res) {
    try {
        const solves = await Solve.find({task: req.params.taskId, user: req.params.userId})
        res.status(200).json(solves)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByUserId = async function (req, res) {
    try {
        const solves = await Solve.find({user: req.params.userId})
        res.status(200).json(solves)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Solve.remove({_id: req.params.id})
        res.status(200).json({
            message: 'Решение удалено.'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getByTaskAndChecking = async function (req, res) {
    const indx = okTask.findIndex(ok => (ok.task === req.body.task) && (ok.user === req.body.user)
        && (ok.date === req.body.date))
    console.log('indexOkTask', indx)
    if (indx !== -1) {
        const solve = await Solve.findOne({task: req.body.task, user: req.body.user, date: req.body.date})
        console.log('solve', solve)
        okTask.splice(indx, 1)
        res.status(200).json(solve);
    } else {
        const q = {
            task: req.body.task,
            user: req.body.user,
            code: req.body.code,
            language: req.body.language,
            date: req.body.date,
        }
        console.log('tekEl', tekEl)
        console.log('q', q)
        if (q.task === tekEl.task && q.user === tekEl.user && q.code === tekEl.code &&
            q.language === tekEl.language && q.date === tekEl.date) {
            res.status(200).json({
                task: req.body.task,
                user: req.body.user,
                code: req.body.code,
                language: req.body.language,
                date: req.body.date,
                message: 'Checking'
            })
        } else {
            res.status(200).json({
                task: req.body.task,
                user: req.body.user,
                code: req.body.code,
                language: req.body.language,
                date: req.body.date,
                message: 'Waiting'
            })
        }
    }
}