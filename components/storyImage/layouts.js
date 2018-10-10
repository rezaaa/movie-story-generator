import {getYear} from '../../utils/utils';

const layouts = (layout, canvas, ctx, base64Image, themes, activeTheme, data, genres, rate) => {
  let img = new Image();
  img.setAttribute("src", base64Image);
  img.setAttribute('crossOrigin', 'anonymous');

  const itemGenres = genres.map(item => {
    return item.name
  })

  if (layout == 'story') {
    canvas.width = 1080;
    canvas.height = 1920;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = themes[activeTheme].background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const imageWidth = 800;
    const radius = 10;
    const borderSize = 30;

    img.onload = () => {
      const imageHeight = imageWidth * img.height / img.width;
      // poster border
      ctx.save();
      roundedReact(ctx, (canvas.width / 2) - imageWidth / 2, 200, imageWidth, 1185, radius, themes[activeTheme].imageBg, themes[activeTheme].imageBg, borderSize);
      ctx.clip();
      // poster
      ctx.drawImage(img, (canvas.width / 2) - imageWidth / 2, (1185 / 2) - (imageHeight / 2) + 200, imageWidth, imageHeight);
      ctx.restore();

      // rating
      roundedReact(ctx, (canvas.width / 2) - 150, 130, 300, 150, 40, themes[activeTheme].ratingBg);
      ctx.textAlign="center";
      ctx.fillStyle = themes[activeTheme].ratingText;
      ctx.font = "40px roboto";
      ctx.fillText('My Rate', canvas.width / 2, 168);
      ctx.font = "bold 55px roboto";
      ctx.fillText(Math.round(rate*2)/2, canvas.width / 2, 235);
    }
    
    // info box
    roundedReact(ctx, (canvas.width / 2) - (imageWidth / 2) - (borderSize / 2), 1425, imageWidth + borderSize, 180, radius * 2, themes[activeTheme].infoBg);

    // type
    roundedReact(ctx, 780, 1442, 160, 60, radius, themes[activeTheme].background);
    ctx.textAlign="center";
    ctx.font = "bold 35px roboto";
    ctx.fillStyle = themes[activeTheme].title;
    ctx.fillText(data.media_type ? data.media_type.toUpperCase() : 'MOVIE', 859, 1473);

    // year
    ctx.font = "40px roboto";
    ctx.fillStyle = themes[activeTheme].text;
    ctx.textAlign="left";
    ctx.fillText(`Year: ${getYear(data.first_air_date || data.release_date)}`, 155, 1470);

    // genre
    ctx.font = "40px roboto";
    ctx.fillStyle = themes[activeTheme].text;
    ctx.textAlign="left";
    ctx.fillText(`Genre: ${itemGenres.join(', ')}`, 155, 1560);

    //movie title
    ctx.textAlign="center";
    let defaultFontSize = 65;
    const title = data.original_name || data.title || data.name;
    ctx.font = `bold ${defaultFontSize}px roboto, shabnam`;
    const maxWidth = 830;
    while (ctx.measureText(title).width > maxWidth) {
      defaultFontSize -= 6;
      ctx.font = `bold ${defaultFontSize}px roboto, shabnam`;     
    }
    ctx.fillStyle = themes[activeTheme].title;
    ctx.fillText(title,(canvas.width / 2), 1675);

    // copyright
    ctx.textAlign="center";
    ctx.font = "30px roboto";
    ctx.fillStyle = themes[activeTheme].footerText;
    ctx.fillText('instagram.ir',(canvas.width / 2), 1875);
  }
  if (layout == 'twitter') {
    canvas.width = 1200;
    canvas.height = 674;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = themes[activeTheme].background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const imageWidth = 390;
    const radius = 10;
    const borderSize = 20;
    img.onload = () => {
      const imageHeight = imageWidth * img.height / img.width;
      // poster border
      ctx.save();
      roundedReact(ctx, 50, (canvas.height / 2) - (imageHeight / 2), imageWidth, imageHeight, radius, themes[activeTheme].imageBg, themes[activeTheme].imageBg, borderSize);
      ctx.clip();
      // poster
      ctx.drawImage(img, 50, (canvas.height / 2) - (imageHeight / 2), imageWidth, imageHeight);
      ctx.restore();

      // rating
      roundedReact(ctx, 490, 35, 300, 100, 25, themes[activeTheme].ratingBg);
      ctx.textAlign="center";
      ctx.fillStyle = themes[activeTheme].ratingText;
      ctx.font = "40px roboto";
      ctx.fillText(`My Rate: ${Math.round(rate*2)/2}`, 640, 84);
    }

    //movie title
    ctx.textAlign="left";
    let defaultFontSize = 55;
    const title = data.original_name || data.title || data.name;
    ctx.font = `bold ${defaultFontSize}px roboto, shabnam`;
    const maxWidth = 650;
    ctx.fillStyle = themes[activeTheme].title;
    wrapText(ctx, title, 490, 200, maxWidth, 70);

    // year
    ctx.font = "40px roboto";
    ctx.fillStyle = themes[activeTheme].title;
    ctx.textAlign="left";
    ctx.fillText(`Year: ${getYear(data.first_air_date || data.release_date)}`, 490, 450);

    // genre
    ctx.font = "40px roboto";
    ctx.fillStyle = themes[activeTheme].title;
    ctx.textAlign="left";
    ctx.fillText(`Genre: ${itemGenres.join(', ')}`, 490, 520);

    // copyright
    ctx.textAlign="left";
    ctx.font = "30px roboto";
    ctx.fillStyle = themes[activeTheme].footerText;
    ctx.fillText('instagram.ir',490, 625);
  }
}

const roundedReact = (ctx, x, y, width, height, radius, fill, stroke, lineWidth) => {
  var useStroke = typeof stroke == 'undefined' || stroke !== 0;
  radius = typeof radius == 'undefined' ? 5 : radius;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (useStroke && stroke !== 0) {
    ctx.strokeStyle = typeof stroke == 'undefined' ? 'transparent' : stroke;
    ctx.lineWidth = lineWidth || 0;
    ctx.stroke();
  }
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  } 
  ctx.restore();
};

const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

const layoutsName = ['story', 'twitter'];

export {layouts, layoutsName};