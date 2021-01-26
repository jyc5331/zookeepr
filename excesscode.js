// the "/" brings to the root route which is the homepage of the server
app.get("/", (req, res) => {
  //sendFile both reads file content from the server and sends it to the specified dir
  //the actual html files do not go to the server, only their contents!
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
