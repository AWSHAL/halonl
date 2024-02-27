const path = require('path');

//Exportar todos los archvios de un directorio con su nombre
const fs = require('fs');
const entry = {};
fs.readdirSync('./src').forEach(file => {
  const filePath = path.resolve(__dirname, './src', file);
  
  // Si es un directorio, leer los archivos dentro de él
  if (fs.statSync(filePath).isDirectory()) {
    fs.readdirSync(filePath).forEach(subFile => {
      const subFilePath = path.resolve(filePath, subFile);
      entry[`${file}/${subFile.replace('.js', '')}`] = subFilePath;
    });
  } else {
    entry[file.replace('.js', '')] = filePath;
  }
});

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'f'),                          
    filename: '[name].js',
  },
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