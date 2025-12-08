
function testMatrValidator() {

  Logger.log(validateMatricula(1).status === "success"); // error
  Logger.log(validateMatricula("a").status === "success"); // error
  Logger.log(validateMatricula(42670).status === "success"); // success
  Logger.log(validateMatricula(36272).status === "success"); // success
  Logger.log(validateMatricula(22827).status === "success"); // success
  Logger.log(validateMatricula(40082).status === "success"); // success
  Logger.log(validateMatricula(38571).status === "success"); // success
  Logger.log(validateMatricula(12345).status === "success"); // error
  Logger.log(validateMatricula("12345").status === "success"); // error
} ''
