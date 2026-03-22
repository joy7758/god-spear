<!-- language-switch:start -->
[English](./README.md) | [中文](./README.zh-CN.md)
<!-- language-switch:end -->

<p align="center">
<img src="assets/logo.svg" width="380"/>
</p>

<p align="center">

![npm](https://img.shields.io/npm/v/god-spear)
![节点](https://img.shields.io/node/v/god-spear)
![许可证](https://img.shields.io/npm/l/god-spear)
![下载](https://img.shields.io/npm/dm/god-spear)
![构建](https://img.shields.io/github/actions/workflow/status/joy7758/god-spear/release.yml?label=release)

</p>

# 神枪

*工具、文件和运行时环境的信任门。*

与 Token Governor 和 ARO Audit 一起作为智能体运行时安全套件的一部分。
该仓库重点关注信任门、边界检查和飞行前安全验证。

<p align="center">
<b>显式信任边界·确定性故障·不可变跟踪</b>
</p>

`god-spear` 是 CI 原生安全门，可阻止有风险的 AI 自动化，除非明确定义信任边界、确定性回滚和故障信号。

---

## 在套件中的角色

- 在执行之前检查信任边界。
- 支持风险路径的飞行前验证。
- 对于工具、文件、环境、CI 和运行时入口点很有用。
- 补充预算治理和执行收入。
- 设计为可移动、低侵入控制层。

## 相关项目

- [代币调控器](https://github.com/joy7758/token-governor)
- [ARO审核](https://github.com/joy7758/aro-audit)
- [智能体运行时安全套件概述](https://github.com/joy7758/token-governor/blob/main/docs/agent-runtime-safety-kit.md)

## 外部适配器

有关最小 MCP 样式预检集成示例，请参阅：
https://github.com/joy7758/god-spear-mcp-gate

该适配器在工具执行之前显示了低入侵信任门模式。

- [ARO审核浪链回执](https://github.com/joy7758/aro-audit-langchain-receipt)

这可以在执行后进行，而 God Spear MCP Gate 在工具执行之前处理飞行前信任检查。

## 快速演示

- 该仓库在执行前检查信任边界。
- 请参阅下面的信任门演示和预检结果示例。
- 它旨在补充 Token Governor 和 ARO 审计。

## 演示资产

- [信任门演示](docs/demos/trust-gate-demo.md)
- [保单示例](examples/trust-gate/policy.example.json)
- [预检请求示例](examples/trust-gate/preflight-request.example.json)
- [允许结果示例](examples/trust-gate/allow-result.example.json)
- [拒绝结果示例](examples/trust-gate/deny-result.example.json)

---

## 什么是神枪？

- **收养证据：**参见[ADOPTION.md](ADOPTION.md)


`god-spear` 是AI 智能体和自动化系统的最小安全门。

它强制执行：

- 明确的信任边界声明
- 对缺少撤销逻辑的一票否决
- 确定性故障信号
- 可选的不可变跟踪链（Spear-Trace）

零运行时依赖性。
CI 原生。
完全可拆卸。

---

## 安全模型

god-spear 引入了三个可执行原语：

1. **故障信号**
每个边界跨越都必须定义一个可观察的阈值故障信号。

2. **撤销途径**
每个执行路径都必须定义确定性回滚逻辑。

3. **宽限预算（毫秒）**
本地/边缘安全预算的故障后撤销延迟约束。

如果缺少任何原语 → `FAIL`。

---

## 安装

```bash
npm i -g god-spear
```

---

## 用法

```bash
spear check .spear-rules.json
```

返回：

- `PASS`
- `FAIL`

---

## 供应链完整性

- 支持来源的 npm 发布 (`--provenance`)
- 发布时生成的 SBOM
- CI 中固定的版本
- 确定性文件白名单
- 没有动态安装脚本

---

## 执照

麻省理工学院
