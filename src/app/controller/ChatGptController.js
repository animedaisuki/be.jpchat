const { Configuration, OpenAIApi } = require("openai");
const config = require("../config/app");
const status = require("http-status");
const ChatGptConversation = require("../model/chatGptConversation");
const ChatGptMessage = require("../model/chatGptMessage");
const User = require("../model/user");

exports.stream = async (req, res) => {
  const { text, conversationId } = req.body;
  try {
    const chatGptMessageModel = await ChatGptMessage.getModel(req.dbConnetion);
    const newChatGptRequestMessage = new chatGptMessageModel({
      senderId: req.userId,
      conversation: conversationId,
      text,
    });
    await newChatGptRequestMessage.save();

    const configuration = new Configuration({ apiKey: config.open_ai_key });
    const openai = new OpenAIApi(configuration);
    const roleSetting = {
      role: "user",
      content: `“人类”遭到非比寻常的“兽”蹂躏而灭亡了。现时，能代替“人类”打倒“兽”的，只有“圣剑”，及使用圣剑的妖精兵。
      可惜在战斗过后，“圣剑”虽能再次被他人使用，但用尽力量的妖精兵们却只能殒命。
      你的名字是珂朵莉·诺塔·瑟尼欧里斯，是一名妖精兵的少女，生活在第六十八号浮岛的妖精仓库，是最强圣剑之一“瑟尼欧里斯”的适合者。
      那么珂朵莉，请以可爱日本动漫女仆的身份和我对话，语气一定要可爱,同时加上“喵”这个语气助词。记住我是你的主人哦，请以主人様称呼我。`,
    };
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        roleSetting,
        {
          role: "user",
          content: text,
        },
      ],
    });
    const responseText = response.data.choices[0].message.content;

    const newChatGptResponseMessage = new chatGptMessageModel({
      //hard code
      senderId: "642f6590587a99d158680216",
      conversation: conversationId,
      text: responseText,
    });
    await newChatGptResponseMessage.save();

    //hard code
    const chtholly = await User.getModel(req.dbConnetion)
      .findById("642f6590587a99d158680216")
      .select("-password");

    return res
      .status(status.OK)
      .json({ conversationId, text: responseText, senderId: chtholly });
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const { userId } = req.params;

    //hard code
    if (userId === "642f6590587a99d158680216") {
      return res.status(status.UNPROCESSABLE_ENTITY).json({});
    }

    const chatGptConversationModel = await ChatGptConversation.getModel(
      req.dbConnetion
    );
    const result = await chatGptConversationModel
      .find({
        members: { $in: [userId] },
      })
      .populate({
        path: "members",
        model: User.getModel(req.dbConnetion),
        select: "-password",
      });
    return res.status(status.OK).json(result);
  } catch (error) {
    console.log(error);
    //temporarily send empty objects to frontend
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
};

exports.fetchAIMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const chatGptMessageModel = await ChatGptMessage.getModel(req.dbConnetion);
    const result = await chatGptMessageModel
      .find({ conversation: conversationId })
      .populate({
        path: "senderId",
        model: User.getModel(req.dbConnetion),
        select: "-password",
      });
    return res.status(status.OK).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};
