const Joi=require('@hapi/joi');
const customJoi = Joi.extend(require("joi-age"));



//ResendOtp Validation
const ResendOtpValidation =(data)=>{
  const schema =Joi.object({
    email: Joi.string().min(6).email().required(),     
});

   return schema.validate(data);
};

const registerUserPasswordChangeValidation = (data) => {
  const schema =Joi.object({
          email: Joi.string().min(6).email().required(''), 
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
       // password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
            'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
            'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
          }),       
        password_confirmation: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .options({ messages: { 'any.only': '{{#label}} does not match'} })
    });
   
       return schema.validate(data);

}


const registerUse0rchangePasswordChangeValidation= (data) => {
  const schema =Joi.object({
         userID: Joi.string().required(), 
         oldpassword: Joi.string().required(), 
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
       // password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
            'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
            'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
          }),       
        password_confirmation: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .options({ messages: { 'any.only': '{{#label}} does not match'} })
    });
   
       return schema.validate(data);

}

const verifyTokenPasswordbInputValidation= (data) => {
  const schema =Joi.object({
         userID: Joi.string().required(), 
         token: Joi.string().required(), 
    });
   
       return schema.validate(data);

}
const registerUserValidation = (data) => {
  const schema =Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone:Joi.string().required(),
          email: Joi.string().min(6).email().required(''),     
          country: Joi.string().optional().allow(''),
          referCode:Joi.string().optional().allow(''),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
       // password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
            'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
            'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
          }),       
        password_confirmation: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .options({ messages: { 'any.only': '{{#label}} does not match'} })
    });
   
       return schema.validate(data);

}

const otpPasswordValidation=(data)=>{
  const schema =Joi.object({
    otp: Joi.string().required(),
    email: Joi.string().min(6).email().required(),     
});

   return schema.validate(data);
};

const otpValidation=(data)=>{
  const schema =Joi.object({
    otp: Joi.string().required(),
    email: Joi.string().min(6).email().required(),     
});

   return schema.validate(data);
};

//Login validation email().
const loginValidation= (data) =>{
  const schema =Joi.object({
    email: Joi.string().required(),
      password: Joi.string().min(6).required(),
      ipaddress: Joi.string().required(),
      // password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
      //     'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
      //     'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
      //   }),       
  });
 
     return schema.validate(data);
};


const registerPostUsdtValidation =(data) => {
  const schema =Joi.object({
    Amount: Joi.string().required(),
    userID:  Joi.string().required(),  
    requestType: Joi.string().valid("NAIRA/USDT","USDT/NAIRA").required()  
});

   return schema.validate(data);

}
const profileUpdateInputValidation= (data) => {
  const schema =Joi.object({
          first_name: Joi.string().optional().allow(''),  
         last_name: Joi.string().optional().allow(''),  
           email: Joi.string().optional().allow(''),    
           country: Joi.string().optional().allow(''),
           ProfileImage: Joi.string().base64().optional().allow("")
       });
   
       return schema.validate(data);

}

const payMentValidation=(data) => {
 
  const schema =Joi.object({
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
    feeCharge: Joi.string().required(),
    providerName:  Joi.string().required()
});

   return schema.validate(data);

}

const fundInputValidation =(data) => {
 
  const schema =Joi.object({
    transactionID: Joi.string().required(),
    Amount: Joi.number().integer().required(),
    userID: Joi.string().required(),
    requestType: Joi.string().valid("Paystack", "flutterwave").required(),
});

   return schema.validate(data);

}
const REtryfundInputValidation =(data) => {
 
  const schema =Joi.object({
    transactionID: Joi.string().required(),  
    userID: Joi.string().required(),
    requestType: Joi.string().valid("Paystack", "flutterwave").required(),
});

   return schema.validate(data);

}
const accountStatusInputValidation =(data) => {
 
  const schema =Joi.object({
    action: Joi.string().valid("active", "inactive").required(),
});

   return schema.validate(data);

}
const payMentValidation2 =(data) => {
 
  const schema =Joi.object({
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
    feeCharge: Joi.string().required(),
    providerName:  Joi.string().required(),
    status: Joi.string().valid("active", "inactive").required(),
});

   return schema.validate(data);

}
const addCryptoInputValidation =(data)=>{
  const schema =Joi.object({
    fee:Joi.string().optional().allow(''),
    Amount: Joi.string().required(),
    walletAddress:Joi.string().required(),
    userID: Joi.string().required(),
    currency:Joi.string().required(),
    provider: Joi.string().required(),
    rateID: Joi.string().required()
});

   return schema.validate(data);
}
const  addAccountInputValidation=(data)=>{
  const schema =Joi.object({
    accountNumber: Joi.string().required(),
    accountName: Joi.string().optional().allow(''),
    bankCode:  Joi.string().optional().allow(''),
    userID: Joi.string().required()
});

   return schema.validate(data);
}
const sellCryptoInputValidation=(data)=>{
  const schema =Joi.object({
    fee:Joi.string().optional().allow(''),
    Amount: Joi.string().required(),
    expectedAmount: Joi.string().required(),
    walletAddress:Joi.string().required(),
    currency:Joi.string().required(),
    provider: Joi.string().required(),
    rateID: Joi.string().required(),
    userID: Joi.string().required()
});

   return schema.validate(data);
}
const USDTInputValidation =(data)=>{
  const schema =Joi.object({
    BuyRateValue: Joi.string().required(),
    SellRateValue:  Joi.string().required(),
    provider: Joi.string().required()
   // rateType: Joi.string().valid("USDT", "CRYPTO").required(),
});

   return schema.validate(data);
}

const USDTInputWITHDRAWValidation=(data)=>{
  function roundToTwoDecimalPlaces(value) {
    return Math.round(value * 100) / 100;
  }
  
  const customJoi = Joi.extend((joi) => ({
    type: 'number',
    base: joi.number(),
    messages: {
      'number.round': '{{#label}} must be rounded to 2 decimal places',
    },
    rules: {
      round: {
        method() {
          return this.$_addRule({ name: 'round' });
        },
        validate(value, helpers) {
          if (roundToTwoDecimalPlaces(value) !== value) {
            return helpers.error('number.round');
          }
          return value;
        },
      },
    },
  }));

const schema = customJoi.object({
  paymentMethod: customJoi.string().valid('usdt').required(),
  fee: customJoi.number().round().required(),
  Amount: customJoi.number().round().required(),
  userID: customJoi.string().guid({ version: 'uuidv4' }).required(),
  walletAddress: customJoi.string().required(),
  phoneNumber: customJoi.string().required(),
});

   return schema.validate(data);
}

const fundInputWITHDRAWValidation =(data)=>{
  const schema =Joi.object({
    paymentMethod: Joi.string().valid("bank").required(),
    BankCode:  Joi.string().required(),
    fee:Joi.string().optional().allow('').default("0"),
    Amount: Joi.string().required(),
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
    userID: Joi.string().required()
});

   return schema.validate(data);
}

const referralInputValidation=(data)=>{
  const schema =Joi.object({
  //  Amount: Joi.string().required(),
    userID: Joi.string().required()
});

   return schema.validate(data);
}

const rcryptoBuyInputValidation=(data)=>{
  const schema =Joi.object({
    fee:Joi.string().optional().allow(''),
    Amount: Joi.string().required(),
    expectedAmount: Joi.string().required(),
    walletAddress:Joi.string().required(),
    currency:Joi.string().required(),
    provider: Joi.string().required(),
    rateID: Joi.string().required(),
    email: Joi.string().email().required()
});

   return schema.validate(data);
}

const rolecheckInputValidation=(data)=>{
  const schema =Joi.object({
    actionType:Joi.string().valid('add','remove').required(),
    roleType: Joi.string().valid('admin','customer','staff').required(),
    userID: Joi.string().required()
});

   return schema.validate(data);
}

const UserDepositcheckInputValidation=(data)=>{
  const schema =Joi.object({
    reference: Joi.string().required(),
    userID: Joi.string().required(),
    requestid:Joi.string().required()
});

   return schema.validate(data);
}


const approvDeclinedInputValidation=(data)=>{
  const schema =Joi.object({
    requestID: Joi.string().required(),
    actionType:Joi.string().valid('approve','declined').required(),
});

   return schema.validate(data);
}

// Function to validate a single base64 string as a data URI
function validateBase64AsDataUri(base64String) {
  const dataUriSchema = Joi.string().dataUri();
  const { error, value } = dataUriSchema.validate(base64String);
  return { error, value };
}

// Function to validate the entire article input
function articleInputValidation(data) {
  const schema = Joi.object({
    title: Joi.string().required(),
    keyword: Joi.string().required(),
    message: Joi.string().required(),
    images: Joi.array().items(Joi.string().dataUri()).required()
  });

  const { error, value } = schema.validate(data);

  if (error) {
    console.error('Validation error:', error.details.map(detail => detail.message));
    return { error };
  } else {
    // Validate each image in the images array separately
    for (let i = 0; i < data.images.length; i++) {
      const imageValidationResult = validateBase64AsDataUri(data.images[i]);
      if (imageValidationResult.error) {
        console.error(`Image at index ${i} is not a valid data URI:`, imageValidationResult.error.details.map(detail => detail.message));
        return { error: imageValidationResult.error };
      }
    }

    console.log('All images are valid data URIs');
    return { value };
  }
}

const editarticleInputValidation = (data)=> {
  const schema = Joi.object({
    articleID: Joi.string().required(),
    title: Joi.string().required(),
    keyword: Joi.string().required(),
    message: Joi.string().required(),
    images: Joi.array().items(Joi.string().dataUri()).required()
  });

  const { error, value } = schema.validate(data);

  if (error) {
    console.error('Validation error:', error.details.map(detail => detail.message));
    return { error };
  } else {
    // Validate each image in the images array separately
    for (let i = 0; i < data.images.length; i++) {
      const imageValidationResult = validateBase64AsDataUri(data.images[i]);
      if (imageValidationResult.error) {
        console.error(`Image at index ${i} is not a valid data URI:`, imageValidationResult.error.details.map(detail => detail.message));
        return { error: imageValidationResult.error };
      }
    }

    console.log('All images are valid data URIs');
    return { value };
  }
}

const letterInputValidation=(data)=>{
  const schema =Joi.object({
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required(),
    sendToOneORall: Joi.string().valid('true', 'false').required()
});

   return schema.validate(data);
}

const blockInputValidation=(data)=>{
  const schema =Joi.object({
    userID: Joi.string().required(),
    actionType:Joi.string().valid('block','unblock').required(),
});

   return schema.validate(data);
}

const jobInputValidation =(data)=>{
  const schema =Joi.object({
    title: Joi.string().required(),
    location:Joi.string().required(),
    jobRole: Joi.string().required(),
    descriptions: Joi.string().required(),
});

   return schema.validate(data);
}

const actionappjobInputValidation=(data)=>{
  const schema =Joi.object({
    requestID: Joi.string().required(),
    actionType:Joi.string().valid('approve','unapprove').required(),
});

   return schema.validate(data);
}

module.exports={
  verifyTokenPasswordbInputValidation, referralInputValidation,blockInputValidation,jobInputValidation,letterInputValidation,editarticleInputValidation,rolecheckInputValidation,articleInputValidation,approvDeclinedInputValidation,registerUse0rchangePasswordChangeValidation,rcryptoBuyInputValidation,USDTInputWITHDRAWValidation,fundInputWITHDRAWValidation,USDTInputValidation,sellCryptoInputValidation,actionappjobInputValidation,addCryptoInputValidation,addAccountInputValidation,registerPostUsdtValidation,profileUpdateInputValidation,accountStatusInputValidation,fundInputValidation,REtryfundInputValidation,registerUserValidation,payMentValidation2,ResendOtpValidation,otpValidation,UserDepositcheckInputValidation,otpPasswordValidation,loginValidation,registerUserPasswordChangeValidation,payMentValidation
};

