import React from "react";
import { Breadcrumb, Layout } from "antd";
import RegistrationForm from "./_reg_form.jsx";
import I18n from "i18n-js";
import axios from "axios";
import "../../bundles/i18n/ja.js";
import SideBar from "../home/_sideBar";
const { Content } = Layout;
class User extends React.Component {
  formRef = React.createRef();
  // 挿入機能 「または」 更新機能
  onFinish = (values) => {
    console.log("Finish:", values);
    axios
      .post("api/v1/users", { values })
      .then((response) => {
        alert("User created successful!");
        this.formRef.current?.resetFields();
      })
      .catch((error) => console.log(error));
  };

  onFinishLogin = (values) => {
    console.log("FinishLogin:", values);
    axios
      .post("api/v1/login", { values })
      .then((response) => {
        console.log(response.data);
        alert("Login successful!");
        this.formRef.current?.resetFields();
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SideBar />
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>{I18n.t("home.home")}</Breadcrumb.Item>
              <Breadcrumb.Item>{I18n.t("home.menu1.side1")}</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <RegistrationForm
                onFinish={this.onFinish}
                onFinishLogin={this.onFinishLogin}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default User;
