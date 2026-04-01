import { Button, Form, Input, Typography } from "antd";
import logo from "../../../../assets/image/logo/logoCimo-removebg.png";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

const { Title, Text } = Typography;

const PhoneLoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { sendOtp } = useAuth();

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const res = await sendOtp(values.phone);
      if (res) {
        navigate("/login/otp");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <div style={{ marginBottom: "20px", width: "100px", height: "100px" }}>
          <img src={logo} width={"100%"} alt="Logo" />
        </div>
        <Title level={3}>Chào bạn!</Title>
        <Text>Hãy đăng nhập để tiếp tục</Text>
      </div>
      <div style={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
        <Form form={form} layout="vertical" style={{ width: "100%" }}>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại phải có đúng 10 chữ số!",
              },
            ]}
          >
            <Input
              style={{ padding: "15px", textAlign: "center" }}
              placeholder="Số Điện Thoại"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ height: "50px" }}
              type="primary"
              block
              size="large"
              onClick={handleLogin}
            >
              Tiếp tục
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ width: "100%" }}>
        <Form.Item>
          <Button
            type="default"
            block
            size="large"
            style={{
              backgroundColor: "#E6F7FF",
              color: "#1890FF",
              height: "50px",
            }}
          >
            Đăng ký mới
          </Button>
        </Form.Item>
      </div>
    </>
  );
};

export default PhoneLoginForm;
