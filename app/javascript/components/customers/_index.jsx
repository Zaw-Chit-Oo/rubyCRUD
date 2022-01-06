import React from "react";
import { Breadcrumb, Layout, message, Input, Button, Space } from "antd";
import I18n from "i18n-js";
import "../../bundles/i18n/ja.js";
import axios from "axios";
import SideBar from "../home/_sideBar";
import CustomerForm from "./_form.jsx";
import CustomerTable from "./_table.jsx";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import * as wjcXlsx from "@grapecity/wijmo.xlsx";
import validator from "validator";
const { Content } = Layout;

class Customer extends React.Component {
  formRef = React.createRef();
  state = {
    customers: [],
    items: [],
    groups: [],
    searchText: "",
    searchedColumn: "",
  };

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.exportReport = this.exportReport.bind(this);
  }

  // 検索機能
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            検索
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            リセット
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            フィルター
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    // 検索のデータをフィルターする
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // テブル検索技能
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  // 検索リセット技能
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  // Excels出力技能
  excelExport = () => {
    axios
      // .get("api/v1/customers/excel.xlsx")
      .get('api/v1/downloads/xlsx')
      .then((response) => {
        console.log(response);
        console.log(response.data);
      })
      .catch((error) => console.log(error));
    // axios({
    //   url: 'api/v1/downloads/xlsx',
    //   method: 'GET',
    //   responseType: 'json', // important
    // }).then((response) => {
    //   console.log(response.data);
    //    const url = window.URL.createObjectURL(new Blob([response.data]));
    //    const link = document.createElement('a');
    //    link.href = url;
    //    link.setAttribute('download', 'file.xlsx'); //or any other extension
    //    document.body.appendChild(link);
    //    link.click();
    // });
  };

  // ロード機能
  componentDidMount() {
    this.loadCustomers();
  }

  // ロード機能
  loadCustomers = () => {
    axios
      .get("api/v1/customers.json")
      .then((response) => {
        const data = response.data.customers;
        const item = response.data.items;
        const group = response.data.groups;
        // console.log("Customer", data);
        data.forEach((element) => {
          const customerData = {
            key: element.customer_id,
            id: element.customer_id,
            name: element.name,
            age: element.age,
            email: element.email,
            address: element.address,
            item_name: element.item_name,
            group_name: element.group_name,
            order_date: element.order_date,
            remark: element.remark,
            order_id: element.order_id,
            group_id: element.group_id,
          };

          this.setState((prevState) => ({
            customers: [...prevState.customers, customerData],
            items: item,
            // groups: group,
          }));
        });

        // popup データを表示するため設定する。
        group.forEach((groupData) => {
          const newGroup = {
            key: groupData.id,
            id: groupData.id,
            name: groupData.name,
          };

          this.setState((prevState) => ({
            groups: [...prevState.groups, newGroup],
          }));
        });
      })
      .catch((error) => console.log(error));
  };

  // 再ロード技能
  reloadCustomers = () => {
    this.setState({ customers: [], groups: [] });
    this.loadCustomers();
  };

  customerName = (name) => {
    if (!/^[a-z A-Z ア-ン あ-ん 一-龠]+$/.test(name)) {
      return false;
    }
    return true;
  };

  // 挿入機能 「または」 更新機能
  onFinish = (values) => {
    // console.log("Finish:", values);
    // values.customer_img = values.upload.name;
    // console.log(values.customer_img);
    values.name = validator.trim(values.name);
    values.address = validator.trim(values.address);
    if (this.customerName(values.name)) {
      if (values.id == undefined) {
        if (
          this.state.customers.find(
            (stateCustomer) =>
              ((stateCustomer.name === values.name) || (stateCustomer.email === values.email))
          )
        ) {
          message.warning(I18n.t("message.M007"));
          // this.formRef.current?.resetFields();
        } else {
          axios
            .post("api/v1/customers", { values })
            .then((response) => {
              message.success(response.data.successMessage);
              this.formRef.current?.resetFields();
              this.reloadCustomers();
            })
            .catch((error) => console.log(error));
        }
      } else {
        // console.log("Finish:", values);
        values.order_date = moment(values.order_date).add(1, "days");
        axios
          .post(`/api/v1/customers/update/${values.id}`, { values })
          .then((response) => {
            // alert('Post created successfully');
            message.success(response.data.successMessage);
            this.formRef.current?.resetFields();
            this.reloadCustomers();
            // location.href = "/customers";
          })
          .catch((error) => console.log(error));
      }
    } else {
      message.error(I18n.t("message.M008"));
    }
  };

  // 正しいIDを削除機能
  handleDeleteCustomer = (id) => {
    axios.delete(`api/v1/customers/${id}`).then((response) => {
      if (response.data.errors) {
        message.warning(response.data.errors);
      } else {
        this.setState({
          customers: this.state.customers.filter(
            (customer) => customer.key !== id
          ),
        });
        message.success(response.data.successMessage);
      }
    });
  };

  // ハンドル編集機能
  handleEdit = (record) => {
    this.formRef.current?.setFieldsValue({
      id: record.id,
      name: record.name,
      age: record.age,
      email: record.email,
      address: record.address,
      item_name: record.item_name,
      group_name: record.group_name,
      order_date: moment(record.order_date, "YYYY MM DD"),
      remark: record.remark,
      order_id: record.order_id,
      group_id: record.group_id,
    });
  };

  // Excelを保存する
  save() {
    // Excel出力の日付と時間をファイル名につける
    var today = new Date(),
      date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate(),
      time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const workbook = this.exportReport(this.state.customers);
    workbook.saveAsync("CustomerDataReport" + date + "_" + time + ".xlsx");
  }

  // Excelの出力技能
  exportReport(customer) {
    var book = new wjcXlsx.Workbook();

    var stdNumWidth = 85,
      tableHeaderStyle = new wjcXlsx.WorkbookStyle();

    tableHeaderStyle.font = new wjcXlsx.WorkbookFont();
    tableHeaderStyle.font.bold = true;
    var sheet = new wjcXlsx.WorkSheet(),
      rows = sheet.rows;

    book.sheets.push(sheet);
    sheet.name = "観客データ";

    sheet.columns[0] = new wjcXlsx.WorkbookColumn();
    sheet.columns[0].width = "1ch";
    sheet.columns[1] = new wjcXlsx.WorkbookColumn();
    sheet.columns[1].width = 100;
    sheet.columns[2] = new wjcXlsx.WorkbookColumn();
    sheet.columns[2].width = stdNumWidth;
    sheet.columns[3] = new wjcXlsx.WorkbookColumn();
    sheet.columns[3].width = 200;
    sheet.columns[4] = new wjcXlsx.WorkbookColumn();
    sheet.columns[4].width = stdNumWidth;
    sheet.columns[5] = new wjcXlsx.WorkbookColumn();
    sheet.columns[5].width = 120;
    sheet.columns[6] = new wjcXlsx.WorkbookColumn();
    sheet.columns[6].width = stdNumWidth;
    sheet.columns[7] = new wjcXlsx.WorkbookColumn();
    sheet.columns[7].width = stdNumWidth;
    sheet.columns[8] = new wjcXlsx.WorkbookColumn();
    sheet.columns[8].width = 130;

    // レポートのタイトル - 観客データ
    rows[0] = new wjcXlsx.WorkbookRow();
    rows[0].cells[1] = new wjcXlsx.WorkbookCell();
    rows[0].cells[1].colSpan = 2;
    rows[0].cells[1].value = "観客データ";
    rows[0].cells[1].style = new wjcXlsx.WorkbookStyle();
    rows[0].cells[1].style.basedOn = tableHeaderStyle;
    rows[0].cells[1].style.font = new wjcXlsx.WorkbookFont();
    rows[0].cells[1].style.font.size = 30;
    // rows[0].cells[1].style.font.italic = true;

    rows[2] = new wjcXlsx.WorkbookRow();
    rows[2].style = new wjcXlsx.WorkbookStyle();
    rows[2].style.hAlign = wjcXlsx.HAlign.Center;
    rows[2].cells[1] = new wjcXlsx.WorkbookCell();
    rows[2].cells[1].value = "名前";
    rows[2].cells[1].style = tableHeaderStyle;
    rows[2].cells[2] = new wjcXlsx.WorkbookCell();
    rows[2].cells[2].value = "年齢";
    rows[2].cells[2].style = tableHeaderStyle;
    rows[2].cells[3] = new wjcXlsx.WorkbookCell();
    rows[2].cells[3].value = "メールアドレス";
    rows[2].cells[3].style = tableHeaderStyle;
    rows[2].cells[4] = new wjcXlsx.WorkbookCell();
    rows[2].cells[4].value = "住所";
    rows[2].cells[4].style = tableHeaderStyle;
    rows[2].cells[5] = new wjcXlsx.WorkbookCell();
    rows[2].cells[5].value = "注文アイテム";
    rows[2].cells[5].style = tableHeaderStyle;
    rows[2].cells[6] = new wjcXlsx.WorkbookCell();
    rows[2].cells[6].value = "グループ名";
    rows[2].cells[6].style = tableHeaderStyle;
    rows[2].cells[7] = new wjcXlsx.WorkbookCell();
    rows[2].cells[7].value = "注文日付";
    rows[2].cells[7].style = tableHeaderStyle;
    rows[2].cells[8] = new wjcXlsx.WorkbookCell();
    rows[2].cells[8].value = "備考";
    rows[2].cells[8].style = tableHeaderStyle;

    // テブルスタート
    var firstIdx = 3;

    for (var i = 0; i < customer.length; i++) {
      var curCustomer = customer[i],
        rowIdx = firstIdx + i;
      rows[rowIdx] = new wjcXlsx.WorkbookRow();
      rows[rowIdx].cells[1] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[1].value = curCustomer.name;
      rows[rowIdx].cells[2] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[2].value = curCustomer.age;
      rows[rowIdx].cells[3] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[3].value = curCustomer.email;
      rows[rowIdx].cells[4] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[4].value = curCustomer.address;
      rows[rowIdx].cells[5] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[5].value = curCustomer.item_name;
      rows[rowIdx].cells[6] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[6].value = curCustomer.group_name;
      rows[rowIdx].cells[7] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[7].value = curCustomer.order_date;
      rows[rowIdx].cells[8] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[8].value = curCustomer.remark;
    }

    return book;
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SideBar />
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>{I18n.t("home.home")}</Breadcrumb.Item>
              <Breadcrumb.Item>{I18n.t("home.menu1.side2")}</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {/* 顧客フォーム設定 */}
              <CustomerForm
                onFinish={this.onFinish}
                itemData={this.state.items}
                groupData={this.state.groups}
                editData={this.formRef}
                excelExport={this.save}
                excelExportR={this.excelExport}
              />
              {/* 顧客テーブル設定 */}
              <CustomerTable
                colmnSearch={this.getColumnSearchProps}
                customerData={this.state.customers}
                itemData={this.state.items}
                groupData={this.state.groups}
                onEdit={this.handleEdit}
                onDeleteCustomer={this.handleDeleteCustomer}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Customer;
