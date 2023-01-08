const express = require('express');
const app = express();
const ytdl = require('ytdl-core');

app.use(express.static('public'))
app.use(require('cors')());

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/info', async (req, res) => {
  try {
    const url = req.query.url;

    if (!ytdl.validateURL(url)) return res.status(400).json({
      success: false,
      response: "Input a valid YouTube video URL!"
    });

    const info = await ytdl.getBasicInfo(url, { format: 'mp4' })

    const title = info.player_response.videoDetails.title;

    const channel = info.player_response.videoDetails.author;

    res.status(200).json({
      success: true,
      response: {
        title: title,
        channel: channel
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      response: "Input a valid YouTube video URL!"
    });
  }
})

app.get('/download', async (req, res) => {
  try {
    const url = req.query.url;
    const format = req.query.format || "video";

    if (!ytdl.validateURL(url)) return res.sendStatus(400);

    const info = await ytdl.getBasicInfo(url, { format: 'mp4' })

    const title = info.player_response.videoDetails.title.replace(/[^\x00-\x7F]/g, "") || format;

    if (format === "audio") {
      res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);

      ytdl(url, {
        format: 'mp3',
        filter: 'audioonly',
        quality: 'highest'
      }).pipe(res);
    } else {
      res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

      ytdl(url, {
        format: 'mp4',
        quality: 'highest'
      }).pipe(res);
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(400);
  }
});

app.listen(3000, () => {
  console.log("Raven x Is Run!");
});

"";