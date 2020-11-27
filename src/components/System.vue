<template>
    <div>
        <el-row :gutter="10">
            <el-row :span="12">
                <el-card header="執行緒健康度指標" class="normalText">
                    <el-table :data="timer_data">
                        <el-table-column prop="name" label="名稱" />
                        <el-table-column prop="skip" label="跳過次數" />
                        <el-table-column fixed="right" label="操作" >
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="danger" size="large">重新啟動</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-row>
        </el-row>
    </div>
</template>

<script>
import * as moment from "moment/moment"
import { Toast } from 'mand-mobile'

export default {
    name: "System",
    components:
    {

    },
    props: 
    {

    },
    data()
    {
        return {
            timer_data: [],
            stations: [],
            station: "",
            loading: false,
            date_range: [],
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
        async handleClick(row)
        {
            await fetch("http://10.11.20.108:9999/api/system",
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        [row.name]: row.name, 
                    })
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                Toast.succeed("重新啟動成功")
            })
            .catch( err =>
            {
                this.$notify.warning({ title: 'Edge資料庫存取異常', message: err})
            })
            .finally( () =>
            {
                this.loading = false
            })
            await this.CheckData()
        },
        async CheckData()
        {
            this.loading = true
            await fetch("http://10.11.20.108:9999/api/system",
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
                this.timer_data = []
                Object.keys(response["result"]).forEach( key =>
                {
                    this.timer_data.push(
                        { name: key, skip: response["result"][key] }
                    )
                })

            })
            .catch( err =>
            {
                this.$notify.warning({ title: 'Edge資料庫存取異常', message: err})
            })
            .finally( () =>
            {
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
    .normalText
    {
        font-size: 24px;
    }
</style>