import React, { Component, useState, Fragment } from "react";
import {
  Select,
  Form,
  InputNumber,
  Button,
  Input,
  DatePicker,
  Modal,
  Radio,
  Table,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import I18n from "i18n-js";
import moment from "moment";
// import FormItem from "antd/lib/form/FormItem";

const { Option } = Select;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const { Search } = Input;

const CustomerForm = (props) => {
  const { onFinish, editData, itemData, groupData, excelExport, excelExportR } =
    props;
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setColumnData] = useState(null);
  const [searchData, setsearchData] = useState(null);

  // モーダルの検索データのフィールド
  const searchField = (
    <Form.Item label={I18n.t("customer.groupName")}>
      <Input
        key="1"
        name="searchData"
        value={searchData}
        placeholder="検索"
        onChange={(e) => handleSearch(e.target.value ? [e.target.value] : [])}
      ></Input>
    </Form.Item>
  );

  const handleSelect = (selectData) => {
    setIsModalVisible(true);
    setColumnData(tableData);
    // console.log("HandleSelect of data", tableData);
    setsearchData(selectData);
    handleSearch(selectData);
  };

  const normFile = (e) => {
    console.log("Upload file:", e);
    // console.log("Name : " + e.target.name);
    // console.log(e.file);
    return e && e.file;
  };

  const groups = [];

  // モーダルの検索技能
  const handleSearch = (searchData) => {
    setsearchData(searchData);
    // console.log("Search Data:", searchData);
    for (var i = 0; i < groupData.length; i++) {
      if (
        groupData[i].name
          ?.toLowerCase()
          .includes(searchData.toString()?.toLowerCase())
      ) {
        groups.push(groupData[i]);
      }
    }
    setColumnData(groups);
    // console.log("table Data", tableData);
  };

  // モーダルのテブルコラム
  const columns = [
    {
      title: I18n.t("customer.check"),
      key: "action",
      render: (_text, record) => (
        <Fragment>
          <Radio value={record.id} onChange={() => onChange(record)}></Radio>
        </Fragment>
      ),
    },
    {
      title: I18n.t("customer.groupNameList"),
      dataIndex: "name",
      key: "id",
    },
  ];

  // ラジオボタンのデータ変化技能
  const onChange = (value) => {
    editData.current?.setFieldsValue({
      group_id: value.id,
      group_name: value.name,
    });
    setIsModalVisible(true);
  };

  // モーダルオッケー技能
  const handleOk = () => {
    setIsModalVisible(false);
  };

  // フォームフィールドデータをリセット
  const onReset = () => {
    form.resetFields();
  };

  // 過去の日付を選択できないようにする
  const disabledDate = (current) => {
    return current < moment().endOf("day");
  };

  // フォームのValidationチャック
  const validateMessages = {
    required: "${label}は必須です!",
    types: {
      email: "${label}は有効なメールではありません!",
      number: "${label}は有効な番号ではありません!",
    },
    number: {
      range: "${label}は${min}以上${max}以下です!",
    },
  };

  const fileUpload = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChangeOne(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div
      style={{
        display: "block",
        width: 700,
        // padding: 15,
      }}
    >
      <Form
        {...layout}
        form={form}
        name="nest-messages"
        onFinish={onFinish}
        autoComplete="off"
        ref={editData}
        validateMessages={validateMessages}
      >
        <Form.Item name="id" style={{ display: "none" }}>
          <Input />
        </Form.Item>
        <Form.Item name="group_id" style={{ display: "none" }}>
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label={I18n.t("customer.customerName")}
          rules={[{ required: true }]}
        >
          <Input style={{ width: "60%" }} />
        </Form.Item>
        <Form.Item
          name="age"
          label={I18n.t("customer.age")}
          rules={[{ required: true, type: "number", min: 18, max: 99 }]}
        >
          <InputNumber style={{ width: "60%" }} />
        </Form.Item>
        <Form.Item
          name="email"
          label={I18n.t("customer.email")}
          rules={[{ required: true, type: "email" }]}
        >
          <Input style={{ width: "60%" }} />
        </Form.Item>
        <Form.Item
          name="address"
          label={I18n.t("customer.address")}
          rules={[{ required: true, type: "string" }]}
        >
          <Input style={{ width: "60%" }} />
        </Form.Item>
        <Form.Item
          name="order_id"
          label={I18n.t("customer.orderItem")}
          rules={[{ required: true }]}
        >
          <Select placeholder="アイテムを選択" style={{ width: "60%" }}>
            {itemData.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={I18n.t("customer.groupName")}
          name="group_name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Search
            placeholder="グループ名を選択"
            allowClear
            onSearch={handleSelect.bind(this)}
            style={{ width: "60%" }}
          />
        </Form.Item>

        <Form.Item
          name="order_date"
          label={I18n.t("customer.orderDate")}
          rules={[{ required: true }]}
        >
          <DatePicker
            placeholder="日付を選択"
            style={{ width: "60%" }}
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item
          name="remark"
          label={I18n.t("customer.remark")}
          rules={[
            {
              max: 20,
              message: I18n.t("message.M005"),
            },
          ]}
        >
          <Input.TextArea style={{ width: "60%", resize: "none" }} />
        </Form.Item>
        <Form.Item
          name="upload"
          label={I18n.t("customer.image")}
          valuePropName="file"
          getValueFromEvent={normFile}
        >
          <Upload {...fileUpload} maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to Upload(Max: 1)</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            // style={{ marginLeft: "15%" }}
            style={{ marginLeft: 40 }}
          >
            {I18n.t("common.button.save")}
          </Button>
          <Button
            style={{
              // marginLeft: 30,
              marginLeft: 20,
              background: "#8c8c8c",
              borderColor: "#8c8c8c",
            }}
            type="primary"
            htmlType="button"
            onClick={onReset}
          >
            {I18n.t("common.button.clear")}
          </Button>

          <Button
            style={{
              // marginLeft: 30,
              marginLeft: 20,
              background: "#3f6600",
              borderColor: "#3f6600",
            }}
            type="primary"
            htmlType="button"
            onClick={excelExport}
          >
            {I18n.t("common.button.export")}
          </Button>

          {/* <Button
            style={{
              // marginLeft: 30,
              marginLeft: 5,
              background: "#3f6600",
              borderColor: "#3f6600",
            }}
            type="primary"
            htmlType="button"
            onClick={excelExportR}
          >
            ExcelExport R
          </Button> */}
        </Form.Item>
      </Form>

      {/* グループ選択のモーダル */}
      <Modal
        title="グループ名"
        visible={isModalVisible}
        // onOk={handleOk}
        onCancel={handleOk}
        footer={[<Button onClick={handleOk}>Ok</Button>]}
      >
        {searchField}
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 3 }}
        />
      </Modal>
    </div>
  );
};

export default CustomerForm;
