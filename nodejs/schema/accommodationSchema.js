// 몽구스 라이브러리 가져오기
const mongoose = require("mongoose");
// 스키마 생성 객체 가져오기
const { Schema } = mongoose;

const accommodationSchema = new Schema(
  {
    // 숙소번호
    accommodation_num: {
      type: String,
      require: true,
    },
    // 숙소명
    name: {
      type: String,
      require: true,
    },
    // 연락처
    phone: {
      type: String,
      require: true,
    },
    // 주소
    address: {
      type: String,
      require: true,
    },
    // 지역
    region: {
      type: String,
      require: true,
    },
    // 기준인원
    person: {
      type: Number,
      require: true,
    },
    // 최대인원
    max_person: {
      type: Number,
      require: true,
    },
    // 숙소 설명
    explain: {
      type: String,
      require: true,
    },
    // 숙소 평점
    grade: {
      type: Number,
      require: true,
    },
    // 숙박 금액
    price: {
      type: Number,
      require: true,
    },
    // 사진 (10장)
    photo: {
      type: Array,
      require: true,
    },
    // 참고 주소
    ref_url: {
      type: String,
    },
    // 숙소입력일
    create_date: {
      type: Date,
      default: Date.now,
    },
    // 숙소후기
    review: {
      type: Array,
    },
  },
  { versionKey: false }
);

// 인덱스 추가
accommodationSchema.index({ region: 1 });
accommodationSchema.index({ person: 1, max_person: 1 });

module.exports = mongoose.model("Accommodation", accommodationSchema);
