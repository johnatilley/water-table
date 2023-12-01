module.exports = {
  apps: [
    {
      name: "Water Table",
      script: "./api.js",
      watch: ["./build"],
      ignore_watch: [
        "./node_modules",
        "./logs",
        "./exports",
        "./data",
        "./.git",
      ],
      log_date_format: "YYYY-MM-DD HH:mm:ss.SSS",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
    },
  ],
};
