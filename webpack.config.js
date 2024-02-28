const path = require('path');
const fs = require('fs');

// Función para crear la configuración de webpack para una carpeta de entrada específica
function generateWebpackConfig(inputDir, outputDir) {
  const entry = {};
  const output = {
    path: path.resolve(__dirname, outputDir),
    filename: '[name].js',
  };

  fs.readdirSync(inputDir).forEach(file => {
    const filePath = path.resolve(__dirname, inputDir, file);

    if (fs.statSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach(subFile => {
        const subFilePath = path.resolve(filePath, subFile);
        entry[`${file}/${subFile.replace('.js', '')}`] = subFilePath;
      });
    } else {
      entry[file.replace('.js', '')] = filePath;
    }
  });

  return {
    entry: entry,
    output: output,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader', 
        },
        {
          test: /\.(css|scss)$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true // Opcional: minificar el HTML
              }
            }
          ]
        }
      ],
    },
  };
}

// Configuración de webpack para los formularios de Mautic
const mauticConfig = generateWebpackConfig('./src/mautic', './js/m');

// Configuración de webpack para los formularios
const formConfig = generateWebpackConfig('./src/forms', './js/f');

// Configuración de webpack para los fomularios de WhatsApp
const whatsappConfig = generateWebpackConfig('./src/whatsapp', './js/w');

module.exports = [mauticConfig, formConfig, whatsappConfig];
