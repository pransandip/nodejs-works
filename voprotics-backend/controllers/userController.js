const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const User = require("../models/User");
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions,
} = require('../utils/index');
const Demo = require("../models/Demo");
const stripe = require("../utils/stripeConf");
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const client = require("../utils/sendGrid");
const nodemailer = require('nodemailer');
const { transporter } = require("../utils/nodemailerConfig");
const csvtojson = require("csvtojson");
const Contact = require('../models/Contact');
const path = require("path");
const ContactFile = require('../models/ContactFile');
const mongoose = require("mongoose");
const BusinessTestimonialForm = require('../models/BusinessTestimonialForm');
const TestimonialVideo = require('../models/TestimonialVideo');
const TestimonialText = require('../models/TestimonialText');
const { sesClient } = require("../utils/sesClient");

const showCurrentUser = async (req, res) => {
    try {
        console.log("showCurrentUser", req.user)
        res.status(StatusCodes.OK).json({ user: req.user });
    } catch (err) {
        console.log("err", err);
    }
};

const updateUser = async (req, res) => {
    const { email, name, phone } = req.body;
    console.log("updateUser", req.body);
    if (!email || !name || !phone) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;
    user.phone = phone

    await user.save();
    console.log("updatedUser", user);
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({
        user: tokenUser
    });
};

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values');
    }
    const user = await User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;

    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

const bookDemo = async (req, res) => {
    path.join(__dirname, "../public/assests/images/", "filename")
    try {
        const {
            fName,
            lName,
            email,
            jobTile,
            companyName,
            phoneNumber,
            industry,
            country,
            areaOfInterest,
            comments
        } = req.body;
        if (!email) {
            throw new CustomError.BadRequestError('Please provide both values');
        }

        const customer = await stripe.customers.create({
            name: (fName + " " + lName),
            email,
        });

        if (customer) {
            const demo = await Demo.create({
                fName,
                lName,
                email,
                jobTile,
                companyName,
                phoneNumber,
                industry,
                country,
                areaOfInterest,
                comments,
                stripe_customer_id: customer.id
            }).then(async result => {
                await sesClient.sendEmail({
                    Source: '"Voptrics" <hello@voptrics.com>',
                    Destination: {
                        ToAddresses: [email]
                    },
                    Message: {
                        Body: {
                            Html: {
                                Charset: "UTF-8",
                                Data: `<div style="text-size-adjust: none; background-color: #f5f5f5; margin: 0; padding: 0;">
                                <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                                                    role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                    class="row-content stack" role="presentation"
                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 650px; margin: 0 auto;"
                                                                    width="650">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="column column-1"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                                width="100%">
                                                                                <div class="spacer_block block-1"
                                                                                    style="height:30px;line-height:30px;font-size:1px;"> </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                                                    role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content"
                                                                    role="presentation"
                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #333; background-color: #fff; width: 650px; margin: 0 auto;"
                                                                    width="650">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="column column-1"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 25px; padding-left: 25px; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                                width="50%">
                                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                                    class="image_block block-1" role="presentation"
                                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                    width="100%">
                                                                                    <tr>
                                                                                        <td class="pad"
                                                                                            style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                            <div align="center" class="alignment"
                                                                                                style="line-height:10px; text-align: center"; display: flex; justify-content: center;><img alt="Image"
                                                                                                    src="${process.env.VOPTRICS_URL}/public/assests/images/voptrics-logo.png"
                                                                                                    style="height: auto; display: block; border: 0; max-width: 195px; width: 100%; text-align: center;"
                                                                                                    title="Image" width="195" /></div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>                                                                
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                                                    role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                    class="row-content stack" role="presentation"
                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; background-color: #d6e7f0; width: 650px; margin: 0 auto;"
                                                                    width="650">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="column column-1"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 60px; padding-left: 25px; padding-right: 25px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                                width="100%">                                                                  
                                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                                    class="text_block block-2" role="presentation"
                                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                                    width="100%">
                                                                                    <tr>
                                                                                        <td class="pad"
                                                                                            style="padding-left:15px;padding-right:10px;padding-top:20px;">
                                                                                            <div style="font-family: sans-serif">
                                                                                                <div class=""
                                                                                                    style="font-size: 12px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 18px; color: #052d3d; line-height: 1.5;">
                                                                                                    <p
                                                                                                        style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 75px;">
                                                                                                        <span style="font-size:50px;"><strong><span
                                                                                                                    style="font-size:50px;"><span
                                                                                                                        style="font-size:38px;">Hello</span></span></strong></span>
                                                                                                    </p>
                                                                                                    <p
                                                                                                        style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 51px;">
                                                                                                        <span style="font-size:34px;"><strong><span
                                                                                                                    style="font-size:34px;"><span
                                                                                                                        style="color:#2190e3;font-size:34px;">${companyName}</span></span></strong></span>
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                                <table border="0" cellpadding="10" cellspacing="0"
                                                                                    class="text_block block-3" role="presentation"
                                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                                    width="100%">
                                                                                    <tr>
                                                                                        <td class="pad">
                                                                                            <div style="font-family: sans-serif">
                                                                                                <div class=""
                                                                                                    style="font-size: 12px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                                                                                    <p
                                                                                                        style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
                                                                                                        <span
                                                                                                            style="font-size:18px;color:#000000;">Thank you for providing us information. We will get back to you
                                                                                                            soon.</span></p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>                                                                   
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
                                                    role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                    class="row-content stack" role="presentation"
                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 650px; margin: 0 auto;"
                                                                    width="650">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="column column-1"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 60px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                                width="100%">
                                                                                
                                                                                <table border="0" cellpadding="10" cellspacing="0"
                                                                                    class="text_block block-2" role="presentation"
                                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                                    width="100%">
                                                                                    <tr>
                                                                                        <td class="pad">
                                                                                            <div style="font-family: sans-serif">
                                                                                                <div class=""
                                                                                                    style="font-size: 12px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                                                                    <p
                                                                                                        style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">
                                                                                                        Ireland - 36, Cois Na Habhainn,
                                                                                                        H54E048, Galway</p>
                                                                                                    <p
                                                                                                        style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">
                                                                                                        United Kingdom - 113A St Johns Road Tunbridge Wells Kent TN4 9TU
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                                <table border="0" cellpadding="10" cellspacing="0"
                                                                                    class="divider_block block-3" role="presentation"
                                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                    width="100%">
                                                                                    <tr>
                                                                                        <td class="pad">
                                                                                            <div align="center" class="alignment">
                                                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                                                    role="presentation"
                                                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                                    width="60%">
                                                                                                    <tr>
                                                                                                        <td class="divider_inner"
                                                                                                            style="font-size: 1px; line-height: 1px; border-top: 1px dotted #C4C4C4;">
                                                                                                            <span> </span></td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                                <table border="0" cellpadding="10" cellspacing="0"
                                                                                    class="text_block block-4" role="presentation"
                                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                                    width="100%">
                                                                                    <tr>
                                                                                        <td class="pad">
                                                                                            <div style="font-family: sans-serif">
                                                                                                <div class=""
                                                                                                    style="font-size: 12px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #4F4F4F; line-height: 1.2;">
                                                                                                    <p
                                                                                                        style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;">
                                                                                                        <span style="font-size:14px;">
                                                                                                            <span
                                                                                                                style="background-color:transparent;font-size:14px;">+353-851738110, +44 7776722779</span></span>
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5"
                                                    role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                    class="row-content stack" role="presentation"
                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 650px; margin: 0 auto;"
                                                                    width="650">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="column column-1"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                                width="100%">
                                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                                    class="icons_block block-1" role="presentation"
                                                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                    width="100%">
                                                                                    <tr>
                                                                                        <td class="pad"
                                                                                            style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                                            <table cellpadding="0" cellspacing="0"
                                                                                                role="presentation"
                                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                                width="100%">
                                                                                                <tr>
                                                                                                    <td class="alignment"
                                                                                                        style="vertical-align: middle; text-align: center;">
                                                                                                        <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                                        <!--[if !vml]><!-->
                                                                                                        <table cellpadding="0" cellspacing="0"
                                                                                                            class="icons-inner" role="presentation"
                                                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                                                                                                            <!--<![endif]-->
                                                                                                            <tr>                                                                                                
                                                                                                                <td
                                                                                                                    style="font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;">
                                                                                                                    <a href="#"
                                                                                                                        style="color: #9d9d9d; text-decoration: none;"
                                                                                                                        target="_blank">Voptrics</a></td>
                                                                                                            </tr>
                                                                                                            <tr>                                                                                                
                                                                                                                <td
                                                                                                                    style="font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;">
                                                                                                                    <span
                                                                                                                        style="color: #9d9d9d; text-decoration: none;"
                                                                                                                        target="_blank">Contact Us: <a href="#" >hello@voptrics.com</a></span></td>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table><!-- End -->
                            </div>`
                            }
                        },
                        Subject: {
                            Charset: "UTF-8",
                            Data: "Added to waitlist successfully."
                        }
                    }
                }, (err, data) => {
                    if (err) {
                        console.log('Error occurred. ' + err);
                    } else {
                        console.log("ses data", data);
                        res.status(StatusCodes.CREATED).json({ msg: "Success! Demo Request Placed" });
                    }
                })
            }).catch(err => {
                console.log("err", err);
            })
        }
    } catch (err) {
        console.log("book demo err", err);
    }
}

const getDemoList = async (req, res) => {
    const demoList = await Demo.find({});
    res.status(StatusCodes.OK).json({ msg: "Success! Demo List Fetched", body: demoList });
}

const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId }).select('-password');
    console.log("user", user);
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ msg: "Success!", body: user });
};

const createPayment = async (req, res) => {
    try {
        let body = null;
        const demoUser = await Demo.find({ email: req.body.email });
        if (!demoUser) {
            throw new CustomError.NotFoundError(`No user with email : ${req.body.email}`);
        }
        console.log("demoUser", demoUser);
        //gold prod_OFVeCAPMMYPASF / price_1NT0dIBuJdnrTw5BulEqEBGp
        //silver prod_OFVfZiZR1VM1Wj / price_1NT0edBuJdnrTw5B4cyjP7oh
        //bronz prod_OFVdaEPpMME3ub / price_1NT0cXBuJdnrTw5Bc99ktDub
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: "price_1NT0cXBuJdnrTw5Bc99ktDub",
                    quantity: 1,//allow only when product price is not metered
                },
            ],
            // customer: req.user.stripe_customer_id,
            success_url: "https://voptrics.com/",
            cancel_url: "https://voptrics.com/",
        });
        console.log("session", session);
        if (session) {
            body = await Payment.create({
                buyerId: demoUser[0]._id,
                stripe_customer_id: demoUser[0].stripe_customer_id,
                transactionAmount: req.body.transactionAmount,
                transactionDate: new Date(),
                transactionStatus: "Paid",
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                jobTile: req.body.jobTile,
                companyName: req.body.companyName,
                phoneNumber: req.body.phoneNumber,
                checkout_id: session.id
            })
        }
        res.status(StatusCodes.OK).json({ msg: "success", body, session });
    } catch (err) {
        console.log("create payment err", err);
    }
}

const createSubscription = async (req, res) => {
    try {
        let body = null;
        const demoUser = await Demo.find({ email: req.body.email });
        if (!demoUser) {
            throw new CustomError.NotFoundError(`No user with email : ${req.body.email}`);
        }
        console.log("demoUser", demoUser);
        //bronz prod_OFWU7WcSgdvkZE / price_1NT1RmBuJdnrTw5BjHXJnHZI
        const subscription = await stripe.subscriptions.create({
            customer: demoUser[0].stripe_customer_id,
            items: [
                { price: 'price_1NT1RmBuJdnrTw5BjHXJnHZI' },
            ],
        });
        console.log("subscription", subscription);
        if (subscription) {
            body = await Subscription.create({
                buyerId: demoUser[0]._id,
                stripe_customer_id: demoUser[0].stripe_customer_id,
                transactionAmount: req.body.transactionAmount,
                transactionDate: new Date(),
                transactionStatus: "Paid",
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                jobTile: req.body.jobTile,
                companyName: req.body.companyName,
                phoneNumber: req.body.phoneNumber,
                subscription_id: subscription.id,
                invoice_id: subscription.latest_invoice
            })
        }
        res.status(StatusCodes.OK).json({ msg: "success", body, subscription });
    } catch (err) {
        console.log("create subscription err", err);
    }
}

const createSubscriptionPayment = async (req, res) => {
    try {
        let body = null;
        const demoUser = await Demo.find({ email: req.body.email });
        if (!demoUser) {
            throw new CustomError.NotFoundError(`No user with email : ${req.body.email}`);
        }
        console.log("demoUser", demoUser);
        //gold prod_OFVeCAPMMYPASF / price_1NT0dIBuJdnrTw5BulEqEBGp
        //silver prod_OFVfZiZR1VM1Wj / price_1NT0edBuJdnrTw5B4cyjP7oh
        //bronz prod_OFVdaEPpMME3ub / price_1NT0cXBuJdnrTw5Bc99ktDub
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: "price_1NT1RmBuJdnrTw5BjHXJnHZI",
                    // quantity: 1,//allow only when product price is not metered
                },
            ],
            // customer: req.user.stripe_customer_id,
            success_url: "https://voptrics.com/",
            cancel_url: "https://voptrics.com/",
            customer: demoUser[0].stripe_customer_id
        });
        console.log("session", session);
        if (session) {
            body = await Payment.create({
                buyerId: demoUser[0]._id,
                stripe_customer_id: demoUser[0].stripe_customer_id,
                transactionAmount: req.body.transactionAmount,
                transactionDate: new Date(),
                transactionStatus: "Paid",
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                jobTile: req.body.jobTile,
                companyName: req.body.companyName,
                phoneNumber: req.body.phoneNumber,
                checkout_id: session.id
            }).then(async result => {
                console.log("result", result);
                await Subscription.findOneAndUpdate({
                    buyerId: demoUser[0]._id,
                    stripe_customer_id: demoUser[0].stripe_customer_id,
                }, {
                    paymentId: result._id
                })
            }).catch(err => {
                console.log("create subscription payment err", err);
            })
        }
        res.status(StatusCodes.OK).json({ msg: "success", body, session });
    } catch (err) {
        console.log("create subscription payment err", err);
    }
}

const getSubscription = async (req, res) => {
    let body = null;
    const user = await User.find({ _id: req.user.userId });
    console.log("user", user);
    if (!user) {
        throw new CustomError.NotFoundError(`No user found`);
    }

    await Subscription.aggregate([
        {
            $match: {
                buyerId: user[0].buyerId
            }
        },
        {
            $lookup:
            {
                from: "demos",
                localField: "buyerId",
                foreignField: "_id",
                as: "demoUserDetails"
            }
        },
        {
            $lookup:
            {
                from: "payments",
                localField: "paymentId",
                foreignField: "_id",
                as: "paymentDetails"
            }
        },
    ])
        .then(async result => {
            console.log("subscription", result);
            body = result;
            const invoice = await stripe.invoices.retrieve(result[0].invoice_id);
            res.status(StatusCodes.OK).json({ msg: "success", body, invoice });
        })
        .catch(error => console.log("Error", error));
}

const sendMail = async (req, res) => {
    await transporter.sendMail({
        from: `${req.body.companyName} ${req.body.email}`, // sender address
        to: req.body.recipients,
        subject: req.body.subject,
        html: `<div background-color="#f6f6f6" font-family="sans-serif" -webkit-font-smoothing="antialiased" font-size="14px" line-height="1.4" margin="0" padding="0" -ms-text-size-adjust="100%" -webkit-text-size-adjust="100%" >  
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
        <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
        <td padding="0 !important" width="100% !important" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
        <div padding="0 !important" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
        <table role="presentation" border-left-width="0 !important" border-radius="0 !important" border-right-width="0 !important" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
        <tr>
        <td padding="10px !important" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
        <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hello Dear,</p>
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">We are glad to share survey link with you. Please feel free to submit as soon as possible</p>
        <br /><br />
        <span >Name: ${req.body.companyName}</span><br />
        <span >Email: ${req.body.email}</span><br />
        <span >Survey Link: <a href={${req.body.surveyLink}} >Click Here</a> to fill survey</span><br />
        <br /><br />
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Thank you so much for your cooperation<br /></p>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
      
        <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
        <tr>
        <td style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">
        <span color="inherit !important"; font-family="inherit !important"; font-size="inherit !important"; font-weight="inherit !important"; line-height="inherit !important"; text-decoration="none !important"; style="color: #999999; font-size: 12px; text-align: center;">${req.body.companyName}}</span>
        <br> Contact Us: <a href=${req.body.email} style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">${req.body.email}</a>.
        </td>
        </tr>
        </table>
        <div>
      
        <div>
        </td>
        </tr>
        </table>
        </div><br />
        </div>`,
    }, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.status(StatusCodes.OK).json({
            msg: "success", body: {
                messageId: info.messageId,
                testMessageUrl: nodemailer.getTestMessageUrl(info),
            }
        });
    });
}

const importContacts = async (req, res) => {
    try {
        let reqFiles = [];
        const url = req.protocol + '://' + req.get('host')
        console.log(url)
        for (let i = 0; i < req.files.length; i++) {
            console.log(req.files[i].filename)
            reqFiles.push(url + '/public/contacts/' + req.files[i].filename)
        }
        console.log("csv", reqFiles);
        const uploadedContacts = await ContactFile.create({
            businessId: req.user.userId,
            fileName: req.files[0].filename,
            filePath: reqFiles,
            contactType: "customer",
            contactEntry: "csv"
        });

        if (uploadedContacts) {
            var arrayToInsert = [];
            console.log("filePath", path.join(__dirname, "../public/contacts/", req.files[0].filename));
            console.log("fileName", req.files[0].filename)
            csvtojson().fromFile(path.join(__dirname, "../public/contacts/", req.files[0].filename)).then(async source => {

                for (let i = 0; i < source.length; i++) {
                    let oneRow = {
                        businessId: req.user.userId,
                        firstName: source[i]["first_name"],
                        lastName: source[i]["last_name"],
                        companyName: source[i]["company_name"],
                        email: source[i]["email"],
                        address: source[i]["address"],
                        city: source[i]["city"],
                        country: source[i]["county"],
                        state: source[i]["state"],
                        zip: source[i]["zip"],
                        phone: source[i]["phone"],
                        fileId: uploadedContacts?._id,
                        fileName: req.files[0].filename,
                        filePath: reqFiles,
                        contactType: "customer",
                        contactEntry: "csv"
                    };
                    arrayToInsert.push(oneRow);
                }

                await Contact.insertMany(arrayToInsert, (err, result) => {
                    if (err) console.log(err);
                    if (result) {
                        console.log("Import CSV into database successfully");
                        res.status(StatusCodes.CREATED).json({ msg: "success", data: uploadedContacts, result })
                    }
                });

            }).catch(err => {
                console.log("err", err);
            });
        }
    } catch (err) {
        console.log("err", err);
    }
}

const getBusinessContacts = async (req, res) => {
    var page = req.body.page;
    var limit = req.body.limit;
    var skp = (page) * limit;

    const businessContacts = await Contact.aggregate([
        {
            $match: {
                businessId: new mongoose.Types.ObjectId(req.user.userId),
            }
        },
        {
            $lookup:
            {
                from: "contactfiles",
                localField: "fileId",
                foreignField: "_id",
                as: "fileDetails"
            }
        },
        {
            $skip: skp
        },
        {
            $limit: limit
        },
        { $sort: { createdAt: -1 } },
    ])
        .then(result => {
            res.status(StatusCodes.OK).json({ msg: "Success! Contact List Fetched", body: result });
        })
        .catch(error => console.log("Error", error));
}

const addContact = async (req, res) => {
    try {
        const contactAdded = await Contact.create({
            businessId: req.user.userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            companyName: req.body.companyName,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            state: req.body.state,
            zip: req.body.zip,
            phone: req.body.phone,
            contactType: "customer",
            contactEntry: "manual"
        });
        res.status(StatusCodes.CREATED).json({ msg: "Success! Contact Details Added.", })
    } catch (err) {
        console.log("err", err);
    }
}

const deleteContact = async (req, res) => {
    try {
        const deletedContact = await Contact.findOneAndDelete({
            businessId: req.user.userId,
            _id: req.body.id
        });
        res.status(StatusCodes.OK).json({ msg: "Success! Contact Deleted." });
    } catch (err) {
        console.log("err", err);
    }
}

const getSingleContact = async (req, res) => {
    const businessContact = await Contact.aggregate([
        {
            $match: {
                businessId: new mongoose.Types.ObjectId(req.user.userId),
                _id: new mongoose.Types.ObjectId(req.body.id)
            }
        },
        {
            $lookup:
            {
                from: "contactfiles",
                localField: "fileId",
                foreignField: "_id",
                as: "fileDetails"
            }
        }
    ])
        .then(result => {
            res.status(StatusCodes.OK).json({ msg: "Success! Contact Fetched", body: result[0] });
        })
        .catch(error => console.log("Error", error));
}

const updateContact = async (req, res) => {
    try {
        const updatedContact = await Contact.findOneAndUpdate({
            businessId: new mongoose.Types.ObjectId(req.user.userId),
            _id: new mongoose.Types.ObjectId(req.body.id)
        }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            companyName: req.body.companyName,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            state: req.body.state,
            zip: req.body.zip,
            phone: req.body.phone,
        });
        res.status(StatusCodes.CREATED).json({ msg: "Success! Contact Details Updated.", })
    } catch (err) {
        console.log("err", err);
    }
}

const addTestimonialForm = async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host')
        const testimonialForm = await BusinessTestimonialForm.create({
            businessId: req.user.userId,
            logo: url + '/public/images/' + req.file.filename,
            title: req.body.title,
            description: req.body.description,
            questionOne: req.body.questionOne,
            questionTwo: req.body.questionTwo,
            questionThree: req.body.questionThree
        });
        res.status(StatusCodes.CREATED).json({ msg: "Success! Testimonial Form Added.", })
    } catch (err) {
        console.log("err", err);
    }
}

const deleteTestimonialForm = async (req, res) => {
    try {
        const deletedTestimonial = await BusinessTestimonialForm.findOneAndDelete({
            _id: req.body.id,
            businessId: req.user.userId
        });
        res.status(StatusCodes.OK).json({ msg: "Success! Testimonial Deleted.", })
    } catch (err) {
        console.log("err", err);
    }
}

const updateTestimonialForm = async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host')
        const testimonialForm = await BusinessTestimonialForm.findOneAndUpdate({
            _id: req.body.id,
            businessId: req.user.userId
        }, {
            logo: url + '/public/images/' + req.file.filename,
            title: req.body.title,
            description: req.body.description,
            questionOne: req.body.questionOne,
            questionTwo: req.body.questionTwo,
            questionThree: req.body.questionThree
        });
        res.status(StatusCodes.CREATED).json({ msg: "Success! Testimonial Form Updated.", })
    } catch (err) {
        console.log("err", err);
    }
}

const getAllTestimonies = async (req, res) => {
    try {
        const testimonies = await BusinessTestimonialForm.find({ businessId: req.user.userId });
        res.status(StatusCodes.OK).json({ msg: "Success! Testimonial List Fetched.", body: testimonies });
    } catch (err) {
        console.log("err", err);
    }
}

const getSingleTestimony = async (req, res) => {
    try {
        const testimony = await BusinessTestimonialForm.findOne({ businessId: req.body.businessId, _id: req.body.id });
        res.status(StatusCodes.OK).json({ msg: "Success! Testimonial Fetched.", body: testimony });
    } catch (err) {
        console.log("err", err);
    }
}

const uploadTestimonialVideo = async (req, res) => {
    try {
        // console.log(`Video uploaded: ${req.file.filename}`)
        const url = req.protocol + '://' + req.get('host')
        const uploadedVideo = await TestimonialVideo.create({
            businessId: req.body.businessId,
            testimonyId: req.body.testimonyId,
            videoPath: url + '/public/videos/' + req.file.filename,
            name: req.body.name,
            email: req.body.email
        }).then(result => {
            transporter.sendMail({
                from: {
                    "name": "Voptrics",
                    "address": "hello@bytestackai.com"
                }, // sender address
                to: req.body.email,
                subject: "Voptrics Testimonial",
                html: `<div background-color="#f6f6f6" font-family="sans-serif" -webkit-font-smoothing="antialiased" font-size="14px" line-height="1.4" margin="0" padding="0" -ms-text-size-adjust="100%" -webkit-text-size-adjust="100%" >  
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
                <tr>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
                <td padding="0 !important" width="100% !important" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
                <div padding="0 !important" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
                <table role="presentation" border-left-width="0 !important" border-radius="0 !important" border-right-width="0 !important" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
                <tr>
                <td padding="10px !important" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                <tr>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hello ${req.body.name},</p>
                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Your testimonia submitted successfully!</p>
                <br /><br />
                <span >Name: ${req.body.name}</span><br />
                <span >Email: ${req.body.email}</span><br />                    
                <br /><br />
                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Thank you for providing us information.<br /></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
              
                <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                <tr>
                <td style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">
                <span color="inherit !important"; font-family="inherit !important"; font-size="inherit !important"; font-weight="inherit !important"; line-height="inherit !important"; text-decoration="none !important"; style="color: #999999; font-size: 12px; text-align: center;">Voptrics</span>
                <br> Contact Us: <a href="hello@bytestackai.com" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">hello@bytestackai.com</a>.
                </td>
                </tr>
                </table>
                <div>
              
                <div>
                </td>
                </tr>
                </table>
                </div><br />
                </div>`,
            }, (err, info) => {
                if (err) {
                    console.log('Error occurred. ' + err);
                    return process.exit(1);
                }

                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                console.log({
                    msg: "success", body: {
                        messageId: info.messageId,
                        testMessageUrl: nodemailer.getTestMessageUrl(info),
                    }
                });
                console.log("filePath", req.file)
                res.status(StatusCodes.CREATED).json({ msg: "Success! Testimonial Added", });
            });
        }).catch(err => {
            console.log("err", err);
        });
    } catch (err) {
        console.log("err", err);
    }
};

const uploadTestimoniaText = async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host')
        const uploadedTestimonial = await TestimonialText.create({
            businessId: req.body.businessId,
            testimonyId: req.body.testimonyId,
            imagePath: url + '/public/videos/' + req.file.filename,
            name: req.body.name,
            email: req.body.email,
            testimonial: req.body.testimonial
        });
        res.status(StatusCodes.CREATED).json({ msg: "Success! Testimonial Added", });
    } catch (err) {
        console.log("err", err);
    }
}

const getVideoTestimonyList = async (req, res) => {

    const videoTestimonyList = await TestimonialVideo.aggregate([
        {
            $match: {
                businessId: new mongoose.Types.ObjectId(req.user.userId),
                // testimonyId: new mongoose.Types.ObjectId(req.body.testimonyId)
            }
        },
        {
            $lookup:
            {
                from: "businesstestimonialforms",
                localField: "testimonyId",
                foreignField: "_id",
                as: "testimonyDetails"
            }
        }
    ])
        .then(result => {
            let body = result;
            res.status(StatusCodes.OK).json({ msg: "Success! Testimonial Fetched.", body });
        })
        .catch(error => console.log("Error", error));


}

const getTextTestimonialList = async (req, res) => {

    const textTestimonialList = await TestimonialText.aggregate([
        {
            $match: {
                businessId: new mongoose.Types.ObjectId(req.user.userId),
                // testimonyId: new mongoose.Types.ObjectId(req.body.testimonyId)
            }
        },
        {
            $lookup:
            {
                from: "businesstestimonialforms",
                localField: "testimonyId",
                foreignField: "_id",
                as: "testimonyDetails"
            }
        }
    ])
        .then(result => {
            let body = result;
            res.status(StatusCodes.OK).json({ msg: "Success! Testimonial Fetched.", body });
        })
        .catch(error => console.log("Error", error));

}

const getSingleTestimonialVideo = async (req, res) => {
    const singleTestimonialVideo = await TestimonialVideo.aggregate([
        {
            $match: {
                businessId: new mongoose.Types.ObjectId(req.user.userId),
                testimonyId: new mongoose.Types.ObjectId(req.body.testimonyId),
                _id: new mongoose.Types.ObjectId(req.body.id)
            }
        },
        {
            $lookup:
            {
                from: "businesstestimonialforms",
                localField: "testimonyId",
                foreignField: "_id",
                as: "testimonyDetails"
            }
        }
    ])
        .then(result => {
            let body = result[0];
            res.status(StatusCodes.OK).json({ msg: "Success! Testimonial Fetched.", body });
        })
        .catch(error => console.log("Error", error));
}

module.exports = {
    showCurrentUser,
    updateUser,
    updateUserPassword,
    bookDemo,
    getDemoList,
    getSingleUser,
    createPayment,
    createSubscription,
    getSubscription,
    createSubscriptionPayment,
    sendMail,
    importContacts,
    getBusinessContacts,
    addContact,
    deleteContact,
    getSingleContact,
    updateContact,
    addTestimonialForm,
    getAllTestimonies,
    getSingleTestimony,
    uploadTestimonialVideo,
    uploadTestimoniaText,
    getVideoTestimonyList,
    deleteTestimonialForm,
    updateTestimonialForm,
    getTextTestimonialList,
    getSingleTestimonialVideo
}