const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    main: "./src/index.js",
    api: "./src/api.js",
    auth: "./src/auth.js",
    calculator: "./src/calculator.js",
    clients: "./src/clients.js",
    clientsKpisReport: "./src/clientsKpisReport.js",
    clientsReport: "./src/clientsReport.js",
    DeleteById: "./src/DeleteById.js",
    Get: "./src/Get.js",
    login: "./src/login.js",
    Popup: "./src/Popup.js",
    Post: "./src/Post.js",
    Print: "./src/Print.js",
    Put: "./src/Put.js",
    sales: "./src/sales.js",
    salesReport: "./src/salesReport.js",
    salesTransacciones: "./src/salesTransacciones.js",
    userReport:"./src/userReport.js",
    chartDailyReport:"./src/chartDailyReport.js",
    salesPoker: "./src/salesPoker.js",
    chartDailyReportCash: "./src/chartDailyReportCash.js",
    pokerTransactions: "./src/pokerTransactions.js",
    chartDailyPlayerReport: "./src/chartDailyPlayerReport.js",
    aforo:"./src/aforo.js",
    reportByDateAndPlayer:"./src/reportByDateAndPlayer.js",
    chartSummarySalesReport:"./src/chartSummarySalesReport"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js", // ✅ Genera un archivo por cada entrada
    publicPath: "",
    clean: true
  },
  target: ['web', 'es5'],
  stats: { children: true },
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "./dist"),
    compress: true,
    port: 8080,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/"
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: 'assets/[name][ext]'  // ✅ Guarda las imágenes en /dist/assets
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["login"]
    }),
    new HtmlWebpackPlugin({
      filename: "sales.html",
      template: "./src/sales.html",
      chunks: ["sales"]
    }),
    new HtmlWebpackPlugin({
      filename: "clients.html",
      template: "./src/clients.html",
      chunks: ["clients"]
    }),
    new HtmlWebpackPlugin({
      filename: "salesReport.html",
      template: "./src/salesReport.html",
      chunks: ["salesReport"]
    }),
    new HtmlWebpackPlugin({
      filename: "salesTransacctions.html",
      template: "./src/salesTransacctions.html",
      chunks: ["salesTransacciones"]
    }),
    new HtmlWebpackPlugin({
      filename: "registerPage.html",
      template: "./src/registerPage.html",
      chunks: ["main"]
    }),
    new HtmlWebpackPlugin({
      filename: "clientsReport.html",
      template: "./src/clientsReport.html",
      chunks: ["clientsReport"]
    }),
    new HtmlWebpackPlugin({
      filename: "clientsKpisReport.html",
      template: "./src/clientsKpisReport.html",
      chunks: ["clientsKpisReport"]
    }),
    new HtmlWebpackPlugin({
      filename: "userReport.html",
      template: "./src/userReport.html",
      chunks: ["userReport"]
    }),
    new HtmlWebpackPlugin({
      filename: "chartDailyReport.html",
      template: "./src/chartDailyReport.html",
      chunks: ["chartDailyReport"]
    }),
       new HtmlWebpackPlugin({
      filename: "salesPoker.html",
      template: "./src/salesPoker.html",
      chunks: ["salesPoker"]
    }),
        new HtmlWebpackPlugin({
      filename: "chartDailyReportCash.html",
      template: "./src/chartDailyReportCash.html",
      chunks: ["chartDailyReportCash"]
    }),
       new HtmlWebpackPlugin({
      filename: "pokerTransactions.html",
      template: "./src/pokerTransactions.html",
      chunks: ["pokerTransactions"]
    }),
        new HtmlWebpackPlugin({
      filename: "chartDailyPlayerReport.html",
      template: "./src/chartDailyPlayerReport.html",
      chunks: ["chartDailyPlayerReport"]
    }),
      new HtmlWebpackPlugin({
      filename: "chartSummarySalesReport.html",
      template: "./src/chartSummarySalesReport.html",
      chunks: ["chartSummarySalesReport"]
    }),
    new HtmlWebpackPlugin({
      filename: "aforo.html",
      template: "./src/aforo.html", // asegúrate de que este archivo exista
      chunks: ["aforo"]
    }),
       new HtmlWebpackPlugin({
      filename: "reportByDateAndPlayer.html",
      template: "./src/reportByDateAndPlayer.html", // asegúrate de que este archivo exista
      chunks: ["reportByDateAndPlayer"]
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
  ],
}
