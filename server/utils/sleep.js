const sleep = async function (time = 0) {
  return await new Promise((resolve) => {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

module.exports = sleep
