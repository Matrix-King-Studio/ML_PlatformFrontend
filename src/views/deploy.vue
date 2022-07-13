<template>
  <el-container>
    <el-header style="height:50px">
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="208px">
        侧边栏
      </el-aside>
      <el-main>
        主体
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/components/Graph/components/Header';

export default {
  name: "deploy",
  components: {
    Header
  }
}
</script>

<style scoped>

</style>