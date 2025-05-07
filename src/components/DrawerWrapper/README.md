# DrawerWrapper 组件

封装抽屉效果组件。

## 📝 说明

- ✅ 支持插槽自定义header、body、footer内容

## ✅ 用法示例

```vue
<DrawerWrapper v-model="visible" title="New Invoice" :width="616" @close="handleDrawerClose">
  <form>
    <input type="text" id="email" placeholder="e.g.Stephen King" />
  </form>

  <template #footer>
    <button @click="visible = false">取消</button>
    <button class="submit-btn" @click="handleFormSubmit">提交</button>
  </template>
</DrawerWrapper>
```

## 📌 v-model

| 写法              | 类型      | 默认值 | 说明             |
| ----------------- | --------- | ------ | ---------------- |
| `v-model="value"` | `boolean` | false  | 控制组件是否显示 |

## 🔧 Props

| Prop 名称      | 类型              | 默认值 | 说明                                                    |
| -------------- | ----------------- | ------ | ------------------------------------------------------- |
| `maskClosable` | `boolean`         | true   | 是否点击遮罩层就关闭组件，选填                          |
| `closable`     | `boolean`         | false  | 是否显示头部的X按钮 ，选填                              |
| `width`        | `string / number` | —      | 抽屉组件宽度，为number类型时，会默认拼上px单位，选填    |
| `title`        | `string`          | —      | 标题，选填                                              |
| `placement`    | `string`          | left   | 抽屉组件出现的位置,可选值有 left/right/top/bottom，选填 |

## 🧩 插槽 Slots

| 插槽名  | 说明                     |
| ------- | ------------------------ |
| header  | 用于自定义组件header标题 |
| default | 用于自定义组件body内容   |
| footer  | 用于自定义组件footer内容 |

## 版本历史

| 版本  | 变更描述 |
| ----- | -------- |
| 1.0.0 | 初始版本 |
