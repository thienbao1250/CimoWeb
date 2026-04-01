import { useRef } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

import useAuth from "../../../../hooks/useAuth";

const OtpVerificationForm = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [form] = Form.useForm();

  const { verifyOtp } = useAuth();

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const otpValues = form.getFieldsValue();
    otpValues[`otp${index}`] = value; // Cập nhật giá trị của ô hiện tại
    form.setFieldsValue(otpValues); // Cập nhật Form

    if (value && index < 5) {
      // Nếu nhập số mới -> focus vào ô tiếp theo
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && index > 0) {
      const otpValues = form.getFieldsValue();
      if (!otpValues[`otp${index}`]) {
        // Nếu ô hiện tại đang rỗng -> focus về ô trước đó
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const otp = Object.values(values).join(""); // Lấy OTP từ form
      if (otp.length !== 6) {
        messageApi.warning("Vui lòng nhập đủ 6 số OTP!");
        return;
      }
      const res = await verifyOtp(otp);
      if (res) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {contextHolder}

      <div
        style={{
          textAlign: "center",
          display: "flex",
          gap: "10px",
          justifyContent: "normal",
          width: "100%",
        }}
      >
        <ArrowLeftOutlined
          onClick={() => navigate("/login")}
          style={{ fontSize: "20px", cursor: "pointer" }}
        />
        <div style={{ textAlign: "center" }}>
          <Title style={{ margin: 0 }} level={3}>
            Xác nhận OTP
          </Title>
        </div>
      </div>
      <Form form={form} layout="vertical" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {[...Array(6)].map((_, index) => (
            <Form.Item
              key={index}
              name={`otp${index}`}
              rules={[{ required: true, message: "" }]}
            >
              <Input
                ref={(el) => {
                  inputRefs.current[index] = el as HTMLInputElement | null;
                }}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)} // Xử lý khi nhấn Backspace
                maxLength={1}
                style={{
                  width: "50px",
                  height: "50px",
                  textAlign: "center",
                  fontSize: "20px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </Form.Item>
          ))}
        </div>

        <Form.Item>
          <Button type="primary" block size="large" onClick={handleSubmit}>
            Xác nhận OTP
          </Button>
        </Form.Item>
      </Form>
      <div style={{ width: "100%" }}>
        <Form.Item>
          <Button
            onClick={() => navigate("/login")}
            type="default"
            block
            size="large"
            style={{
              backgroundColor: "#E6F7FF",
              color: "#1890FF",
              height: "50px",
            }}
          >
            Nhập lại số Số Điện Thoại
          </Button>
        </Form.Item>
      </div>
    </>
  );
};

export default OtpVerificationForm;
