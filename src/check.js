const publicIp = require('public-ip')
const fs = require('fs')

function Check(dataFilePath) {
    return new Promise(async (resolve, reject) => {
        var currentIp
        try {
            currentIp = await publicIp.v4()
        } catch (error) {
            reject({
                error: true,
                errorSummary: "Unable to get public IP",
                errorMessage: error
            })
        }

        var dataFile
        try {
            dataFile = JSON.parse(fs.readFileSync(dataFilePath))
        } catch (error) {
            reject({
                error: true,
                errorSummary: "Unable to read from data file",
                errorMessage: error
            })
        }

        if (currentIp == dataFile.IP) {
            resolve({
                error: false,
                changed: false,
                currentIP: currentIp
            })
        } else {
            var oldIP = dataFile.IP
            dataFile.IP = currentIp

            try {
                fs.writeFileSync(dataFilePath, JSON.stringify(dataFile))

                resolve({
                    error: false,
                    changed: true,
                    oldIP: oldIP,
                    currentIP: currentIp
                })

            } catch (error) {
                reject({
                    error: true,
                    errorSummary: "Failed to update IP in data file",
                    errorMessage: error
                })
            }
        }
    })
}

module.exports = Check