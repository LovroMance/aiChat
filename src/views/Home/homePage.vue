<script setup>
</script>

<template>
  <el-container style="height: 100vh; min-height: 0">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-menu default-active="2" class="el-menu-vertical-demo" router>
        <el-menu-item index="1" route="/userHome">
          <el-icon>
            <Home />
          </el-icon>
          <template #title>首页</template>
        </el-menu-item>

        <el-menu-item index="2" route="/userFriends">
          <el-icon>
            <UserFilled />
          </el-icon>
          <template #title>好友</template>
        </el-menu-item>

        <el-menu-item index="3" route="/userChat">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <template #title>聊天室</template>
        </el-menu-item>

        <el-menu-item index="4" route="/userInfo" >
          <el-icon>
            <User />
          </el-icon>
          <template #title>个人资料</template>
        </el-menu-item>

        <el-menu-item index="5" route="/userSetting" >
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
