

const constructMessage = (data) => {
  const stringifiedMsg = JSON.stringify(data);
  return JSON.stringify({
    sub_id: data.sub_id,
    msg: data.msg,
    expire: data.expire
  })
}

const sendDataToClient = (client, data) => {
  client.write(`${constructMessage(data)}\n`);
}

module.exports = {
  sendDataToClient
}
