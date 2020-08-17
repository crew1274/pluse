<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="12">
                <el-date-picker v-model="date_range" type="daterange" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                    start-placeholder="開始日期" range-separator="至" end-placeholder="結束日期" 
                    :picker-options="pickerOptions"  @change="CheckData"
                    size="large"/>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="show_list" style="width: 100%" :row-class-name="tableRowClassName" calss="hello">
                <el-table-column label="開始時間" prop="start_time" />
                <el-table-column label="結束時間" prop="end_time" />
                <el-table-column label="詳細訊息" prop="message" />
                <el-table-column label="來源" prop="device" />
            </el-table>
        </el-row>
    </div>
</template>

<script>
import * as moment from "moment/moment"
 
export default {
    name: "Error",
    components:
    {

    },
    props: 
    {

    },
    data()
    {
        return {
            list: [],
            loading: false,
            date_range: [],
            pickerOptions:
            {
                shortcuts: [ {
                text: '昨天',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24)
                    picker.$emit('pick', [start, end]) }
                }, {
                text: '一周前',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end]) }
                }, {
                text: '二周前',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
                    picker.$emit('pick', [start, end]) }
                }, {
                text: '三周前',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 21)
                    picker.$emit('pick', [start, end]) }
                }, {
                text: '四周前',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 28)
                    picker.$emit('pick', [start, end]) }
                }]
            },
        }
    },
    async created()
    {
        moment.locale("zh-tw")
        this.date_range.push(moment().subtract(1,'d').format('YYYY-MM-DD'))
        this.date_range.push(moment().add(1,'d').format('YYYY-MM-DD'))
        await this.CheckData()
    },
    computed:
    {
        show_list()
        {
            let show_map = {}
            let show_list = []
            this.list.forEach( (element) =>
            {
                if(element["message"] in show_map)
                {
                    show_map[element["message"]]["end_time"] = element["datetime"]
                    show_list.push(show_map[element["message"]])
                    delete show_map[element["message"]]
                }
                else
                {
                    show_map[element["message"]] = element
                    show_map[element["message"]]["start_time"] = element["datetime"]
                }
            })
            Object.keys(show_map).forEach( element =>
            {
                show_map[element]["start_time"] = show_map[element]["datetime"]
                show_map[element]["end_time"] = ""
                show_list.push(show_map[element])
            })
            return show_list.reverse()
        }
    },
    methods:
    {
        finishRefresh()
        {
            this.$emit('finishRefresh')
        },
        async CheckData()
        {
            this.loading = true
            await fetch("http://10.11.20.108:9999/api/ErrorHandle?start=" + this.date_range[0] + "&end=" + this.date_range[1],
            {
                method: "GET",
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this.list = response["result"].reverse()
            })
            .catch( err =>
            {
                this.$notify.warning({ title: 'Edge資料庫存取異常', message: err})
            })
            .finally( () => {
                this.loading = false
            })
        },
        tableRowClassName({row})
        {
            if (row["end_time"] == "")
            {
                return 'warning-row'
            }
            else
            {
                return ''
            }
        }
    }
}
</script>

<style scoped>
  .el-table >>> .warning-row
  {
    background: #f15c66;
  }
</style>