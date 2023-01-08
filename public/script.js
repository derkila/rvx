const form = document.querySelector("form"),
  download = document.getElementById("download"),
  title = document.getElementById("title"),
  channel = document.getElementById("channel"),
  video = document.getElementById("video"),
  audio = document.getElementById("audio"),
  card = document.getElementById("card");

form.addEventListener("submit", async event => {
  event.preventDefault();

  const url = form.elements.url.value;

  download.innerHTML = "Downloading<span>.</span><span>.</span><span>.</span>";

  const info = await (await fetch(
    `/info?url=${url}`
  )).json()

  download.innerText = "Download";

  if (info.success !== true) {
    card.style.display = "none"
    new Notyf().error({
      message: info.response,
      duration: 10000,
      icon: false,
      dismissible: true,
      background: "red"
    })
    form.reset();
    form.elements.url.focus();
  } else {
    title.innerHTML = `<b>${info.response.title}</b>`
    channel.innerHTML = `${info.response.channel}`
    video.setAttribute("href", `/download?url=${url}&format=video`)
    audio.setAttribute("href", `/download?url=${url}&format=audio`)
    card.style.display = "block"
  }
});