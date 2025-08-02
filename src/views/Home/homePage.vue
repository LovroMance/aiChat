<script setup>
</script>

<template>
  <el-container style="height: 100vh; min-height: 0">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-menu default-active="2" class="el-menu-vertical-demo" router>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>好友</span>
          </template>
          <el-sub-menu index="1-1">
            <template #title>
              <span>分类1</span>
            </template>
            <el-menu-item index="1-1-1">好友1</el-menu-item>
            <el-menu-item index="1-1-1">好友2</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="1-2">
            <template #title>
              <span>分类2</span>
            </template>
            <el-menu-item index="1-2-1">好友1</el-menu-item>
            <el-menu-item index="1-2-1">好友2</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>

        <el-menu-item index="2" route="/userChat">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <template #title>聊天室</template>
        </el-menu-item>

        <el-menu-item index="3" route="/userInfo" >
          <el-icon>
            <User />
          </el-icon>
          <template #title>个人资料</template>
        </el-menu-item>

        <el-menu-item index="4" route="/setting" >
          <el-icon>
            <Setting />
          </el-icon>
          <template #title>设置</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 聊天框 -->
    <router-view />
  </el-container>
</template>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  border: 0;
}
</style>
