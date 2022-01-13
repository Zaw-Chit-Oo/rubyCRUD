import React, { Component, useState } from "react";
// import { Table, Popconfirm, Input, Button, Space } from "antd";
import { Form, Input, Button, Modal } from "antd";
// import { EditTwoTone, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
// import I18n from "i18n-js";

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const RegistrationForm = (props) => {
  const { onFinish, onFinishLogin } = props;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const onFinish = (values) => {
  //   console.log("Success:", values);
  // };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div
      style={{
        display: "block",
        width: 400,
        marginLeft: 250,
      }}
    >
      <Form
        {...layout}
        form={form}
        name="basic"
        //   labelCol={{ span: 8 }}
        //   wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="user_name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" style={{ marginLeft: 5 }} htmlType="submit">
            Register
          </Button>
          <Button
            style={{
              // marginLeft: 30,
              marginLeft: 5,
              background: "#8c8c8c",
              borderColor: "#8c8c8c",
            }}
            type="primary"
            htmlType="button"
            onClick={onReset}
          >
            Clear
          </Button>

          <Button
            style={{
              // marginLeft: 30,
              marginLeft: 5,
              background: "#5b8c00",
              borderColor: "#5b8c00",
            }}
            type="primary"
            htmlType="button"
            onClick={showModal}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Login"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinishLogin}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input your email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
            <Button
              style={{
                // marginLeft: 30,
                marginLeft: 5,
                background: "#8c8c8c",
                borderColor: "#8c8c8c",
              }}
              type="primary"
              htmlType="button"
              // onClick={form.resetFields()}
            >
              Clear
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RegistrationForm;
