// User관련 API

const express = require("express");
const router = express.Router();
const userSchema = require("../schema/userSchema.js");
const bcrypt = require("bcrypt");

/**
 * 회원 목록
 */
router.get("/userList", async (req, res) => {
  try {
    const userData = await userSchema.find();
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 로그인
 */
router.post("/login", async (req, res) => {
  try {
    const id = req.body.id;
    const password = req.body.password;

    const user = await userSchema.findOne({ id: id });

    if (user) {
      // 조회한 회원이 존재할 경우

      // 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log("비밀번호가 일치하지 않습니다.");
        return res
          .status(401)
          .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      } else {
        res.json({
          _id: user._id,
          id: user.id,
          name: user.name,
          phone: user.phone,
          user_type: user.user_type,
        });
      }
    } else {
      // 회원이 존재하지 않을 경우
      res.json({ message: "회원 정보를 찾을 수 없습니다." });
    }
  } catch (e) {
    res.json({ message: e });
  }
});

/**
 * 회원가입
 */
router.post("/join", async (req, res) => {
  try {
    const id = req.body.id;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;
    const create_date = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

    // 2. 비밀번호 해시화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const idCheck = await userSchema.findOne({ id: id });
    if (!idCheck) {
      // 중복되는 id 없음 - 회원가입
      const data = await userSchema.create({
        id: id,
        password: hashedPassword,
        name: name,
        phone: phone,
        user_type: 0,
        deleted: false,
        create_date: create_date,
        delete_date: 0,
        update_date: 0,
      });

      res.json({ message: "회원가입이 완료되었습니다." });
    } else {
      // ID 중복
      res.json({ message: "해당 ID는 사용중입니다." });
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
