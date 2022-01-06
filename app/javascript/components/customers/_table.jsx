import React, { Component } from "react";
import { Table, Popconfirm, Input, Button, Space } from "antd";
import { EditTwoTone, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import I18n from "i18n-js";

const CustomerTable = (props) => {
  const { onDeleteCustomer, onEdit, customerData, colmnSearch } = props;

  // テーブルコラム
  const columns = [
    {
      title: I18n.t("customer.customerName"),
      dataIndex: "name",
      key: "name",
      ...colmnSearch("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: I18n.t("customer.age"),
      dataIndex: "age",
      key: "age",
      ...colmnSearch("age"),
    },
    {
      title: I18n.t("customer.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: I18n.t("customer.address"),
      dataIndex: "address",
      key: "address",
      ...colmnSearch("address"),
    },
    {
      title: I18n.t("customer.orderItem"),
      dataIndex: "item_name",
      key: "order_id",
    },
    {
      title: I18n.t("customer.groupName"),
      dataIndex: "group_name",
      key: "group_id",
      ...colmnSearch("group_name"),
    },
    {
      title: I18n.t("customer.orderDate"),
      dataIndex: "order_date",
      key: "order_date",
      sorter: (a, b) => a.order_date.localeCompare(b.order_date),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: I18n.t("customer.remark"),
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: I18n.t("customer.action"),
      key: "action",
      render: (_text, record) => (
        <>
          <EditTwoTone
            onClick={() => {
              onEdit(record);
            }}
          />

          <Popconfirm
            title="削除しますか?"
            onConfirm={() => {
              onDeleteCustomer(record.id);
            }}
            okText="はい"
            okType="danger"
            cancelText="いいえ"
          >
            <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Table
      style={{ whiteSpace: "pre" }}
      columns={columns}
      dataSource={customerData}
      // dataSource={datasource}
      bordered
      pagination={{ pageSize: 5, showSizeChanger: false }}
    />
  );
};

export default CustomerTable;
