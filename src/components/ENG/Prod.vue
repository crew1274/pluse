<template>
    <div>
        <div v-if="isLock" class="hello">
            <md-skeleton />
            化金預備出料中...
        </div>
        <div v-else>
            <div v-if="stage == 1">
                <el-row :gutter="10">
                    <el-col :span="16" :offset="4">
                        <md-field title="輸入生產資訊" brief="RFID感應工單、識別證可自動帶入">
                            <md-input-item title="批號" placeholder="支援手動輸入" is-highlight v-model="lot"
                            clearable @click.native="openDialog('lot')"/>
                            <md-input-item title="工號" placeholder="支援手動輸入" is-highlight maxlength=6 v-model="operator"
                            clearable @click.native="openDialog('operator')"/>
                            <md-input-item title="製程序" placeholder="如未輸入即會查詢當站參數" is-highlight v-model="procseq"
                            clearable @click.native="openDialog('procseq')"/>
                        </md-field>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="8" :offset="4">
                        <md-button type="warning" @click="clean" icon="delete">清空/取消</md-button>
                    </el-col>
                    <el-col :span="8">
                        <md-button type="primary" @click="prepare" icon="right">取得參數</md-button>
                    </el-col>
                </el-row>
            </div>
            <div v-else-if="stage == 2">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <md-field title="批號資訊">
                            <md-detail-item title="批號:" :content="lotdata.no" bold />
                            <md-detail-item title="料號:" :content="lotdata.itemno"  />
                            <md-detail-item title="製程序:" :content="lotdata.procseq"  />
                            <md-detail-item title="料號版次:" :content="lotdata.itemno"  />
                            <md-detail-item title="製造版次:" :content="lotdata.mfver"  />
                        </md-field>
                    </el-col>
                    <el-col :span="12">
                        <md-field title="詳細參數">
                            <md-input-item title="板高:" :value="recipe.Height" @click.native="openDialog('recipe.Height')" 
                            clearable align="right" :error="isValidMsg.Height" />
                            <md-input-item title="板寬:" :value="recipe.Width" @click.native="openDialog('recipe.Width')" 
                            clearable align="right" :error="isValidMsg.Width" />
                            <md-input-item title="生產總片數:" :value="recipe.QTY" @click.native="openDialog('recipe.QTY')"
                            clearable align="right" :error="isValidMsg.QTY" />
                            <md-input-item title="每框片數:" :value="recipe.eachQTY" @click.native="openDialog('recipe.eachQTY')"
                            clearable align="right" :error="isValidMsg.eachQTY" />
                            <md-radio-group v-model="use_mode">
                                <md-radio-box name="系統時間">系統設定</md-radio-box>
                                <md-radio-box name="虛擬量測">虛擬量測</md-radio-box>
                            </md-radio-group>
                            <div v-if="use_mode == '虛擬量測'">
                                <md-input-item title="化鎳時間(秒):" :value="recipe.ENiPlatedtime" 
                                    align="right" disabled>
                                    <div slot="left">
                                        <span>虛擬量測</span>
                                    </div>
                                </md-input-item>
                                <md-input-item title="化金時間(秒):" :value="recipe.EAuPlatedtime" 
                                    align="right" disabled>
                                    <div slot="left">
                                        <span>虛擬量測</span>
                                    </div>
                                </md-input-item>
                            </div>
                            <div v-else>
                                <md-input-item title="化鎳時間(秒):" :value="recipe.ENiPlatedtime" 
                                    @click.native="openDialog('recipe.ENiPlatedtime')"
                                    clearable align="right">
                                    <div slot="left">
                                        <span>系統設定</span>
                                    </div>
                                </md-input-item>
                                <md-input-item title="化金時間(秒):" :value="recipe.EAuPlatedtime" 
                                    @click.native="openDialog('recipe.EAuPlatedtime')"
                                    clearable align="right">
                                    <div slot="left">
                                        <span>系統設定</span>
                                    </div>
                                </md-input-item>
                            </div>
                            <md-input-item title="厚金時間(秒):" :value="recipe.EHAuPlatedtime" @click.native="openDialog('recipe.EHAuPlatedtime')"
                            clearable align="right"  />
                        </md-field>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <center>
                        <div v-show="errMsg" class="errMsg">
                            {{errMsg}}
                        </div>
                    </center>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="8">
                        <md-button type="warning" @click="clean" icon="delete">清空/取消</md-button>
                    </el-col>
                    <el-col :span="8">
                        <md-button  @click="spec_reload" icon="switch">更新參數規範</md-button>
                    </el-col>
                    <el-col :span="8">
                        <md-button type="primary" @click="prod('ENG')" icon="security" :inactive="isValid">確認投料</md-button>
                    </el-col>
                </el-row>
            </div>
        </div>
        <md-landscape v-model="isDone">
            <img :src="celebrate">
            <span id="d">操作完成，點選跳回上一頁</span>
        </md-landscape>
        <md-landscape v-model="isFailed">
            <img :src="failed">
            <span id="d">投料失敗，請查看詳細原因</span>
        </md-landscape>
        <md-dialog title="" v-model="editDialog.open">
            <div style="height:600px">
                <md-scroll-view auto-reflow :scrolling-x="false">
                    <md-input-item title="修改值:" v-model="editDialog.target" :solid="false" />
                    <md-input-item title="覆寫值:" v-model="editDialog.overwrite" :solid="false" >
                        <div slot="right">
                            <span @click="doPaste()">貼上</span>
                        </div>
                    </md-input-item>
                    <md-number-keyboard v-model="editDialog.isNumberShow" ok-text="確認" :text-render="keyFormatter"
                    @enter="editDialogEnter" @delete="editDialogDelete" @confirm="editDialogConfirm" is-view />
                    <md-field-item title="特殊字元">
                        <md-radio name="." v-model="keyBoardRender" label="." inline />
                        <md-radio name="-" v-model="keyBoardRender" label="-" inline />
                        <md-radio name="_" v-model="keyBoardRender" label="_" inline />
                    </md-field-item>
                </md-scroll-view>
            </div>
        </md-dialog>
    </div>
</template>

<script>
import { Button, Toast, NumberKeyboard, Field, FieldItem, InputItem, Dialog, Switch, DetailItem
        ,RadioBox, RadioGroup, Radio, ScrollView, Skeleton, Landscape} from "mand-mobile"
import X2JS from 'x2js'
import * as moment from "moment/moment"

export default {
  name: "Prod",
  components: {
    [Button.name]: Button,
    [Landscape.name]: Landscape,
    [ScrollView.name]: ScrollView,
    [Switch.name]: Switch,
    [Field.name]: Field,
    [InputItem.name]: InputItem,
    [NumberKeyboard.name]: NumberKeyboard,
    [Dialog.name]: Dialog,
    [DetailItem.name]: DetailItem,
    [RadioBox.name]: RadioBox,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [FieldItem.name]: FieldItem,
    [Skeleton.name]: Skeleton,

  },
  props:
  {
        isRefresh: Boolean,
  },
  data() 
  {
    return {
        use_mode: "虛擬量測",
        celebrate: require("@/assets/celebrate.png"),
        failed: require("@/assets/failed.png"),
        isDone: false,
        isFailed: false,
        isLock: false,
        keyBoardRender: ".",
        stage: 1,
        errMsg: "",
        editDialog:
        {
          open: false, // 控制開關
          target: "", // 目標值
          target_key: "",
          overwrite: "", // 覆寫值
          isNumberShow: true,
          btns: [
            {
              text: '取消',
              warning : true,
            },
          ],
        },
        lot: "",
        operator: "",
        procseq: "",
        payload:
        {
            mfdata:
            {
                lotdata:
                {
                    no: null,
                    procseq: null
                }
            }
        },
        lotdata:
        {
            itemno: null,
            itemver: null,
            mfver: null,
            no: null,
            procseq: null,
        },
        procdata:
        {
            procname: null,
            procprams: 
            {
              procpram: []
            },
        },
        recipe:
        {
            Height: "", //板高
            Width: "", //版寬
            QTY: "", //片數
            eachQTY: 2, //片數
            ENiPlatedtime: "", //化鎳
            EAuPlatedtime: "", //化金
            EHAuPlatedtime: "", //厚金
        },
        spec:
        {
            ENG:
            {
                HEIGHT_MAX: 650.00,
                HEIGHT_MIN: 300.00,
                WIDTH_MAX: 600.00,
                WIDTH_MIN: 300.00,
                QTY_MAX: 9,
                QTY_MIN: 0,
                EACHQTY_MAX: 3,
                EACHQTY_MIN: 1,
            },
            SAND:
            {
                HEIGHT_MAX: 650.00,
                HEIGHT_MIN: 300.00,
                WIDTH_MAX: 600.00,
                WIDTH_MIN: 300.00,
                QTY_MAX: 6,
                QTY_MIN: 1
            }
        }
      }
    },
    computed:
    {
        redis_msg()
        {
            return this.$store.state.redis_msg
        },
        isValid()
        {
            return  ! Object.values(this.isValidMsg).every(x => (x === ""))
        },
        isValidMsg()
        {
            let ob = this._.clone(this.recipe, true)
            ob["ENiPlatedtime"] = ""
            ob["EAuPlatedtime"] = ""
            ob["EHAuPlatedtime"] = ""
            if(this.recipe["Height"] > this.spec.ENG.HEIGHT_MAX)
            {
                ob["Height"] = "不可大於" + this.spec.ENG.HEIGHT_MAX.toString()
            }
            else if(this.recipe["Height"] < this.spec.ENG.HEIGHT_MIN)
            {
                ob["Height"] = "不可小於" + this.spec.ENG.HEIGHT_MIN.toString()
            }
            else if(isNaN(this.recipe["Height"]))
            {
                ob["Height"] = "不可為空值"
            }
            else
            {
                ob["Height"] = ""
            }

            if(this.recipe["Width"] > this.spec.ENG.WIDTH_MAX)
            {
                ob["Width"] = "不可大於" + this.spec.ENG.WIDTH_MAX.toString()
            }
            else if(this.recipe["Width"] < this.spec.ENG.WIDTH_MIN)
            {
                ob["Width"] = "不可小於" + + this.spec.ENG.WIDTH_MIN.toString()
            }
            else if(isNaN(this.recipe["Width"]))
            {
                ob["Width"] = "不可為空值"
            }
            else
            {
                ob["Width"] = ""
            }

            if(this.recipe["QTY"] > this.spec.ENG.QTY_MAX)
            {
                ob["QTY"] = "不可大於" + this.spec.ENG.QTY_MAX.toString()
            }
            else if(this.recipe["QTY"] < this.spec.ENG.QTY_MIN)
            {
                ob["QTY"] = "不可小於" + + this.spec.ENG.QTY_MIN.toString()
            }
            else if(isNaN(this.recipe["QTY"]))
            {
                ob["QTY"] = "不可為空值"
            }
            else
            {
                ob["QTY"] = ""
            }

            if(this.recipe["eachQTY"] > this.spec.ENG.EACHQTY_MAX)
            {
                ob["eachQTY"] = "不可大於" + this.spec.ENG.EACHQTY_MAX.toString()
            }
            else if(this.recipe["eachQTY"] < this.spec.ENG.EACHQTY_MIN)
            {
                ob["eachQTY"] = "不可小於" + + this.spec.ENG.EACHQTY_MIN.toString()
            }
            else if(isNaN(this.recipe["eachQTY"]))
            {
                ob["eachQTY"] = "不可為空值"
            }
            else if( Math.round(this.recipe["QTY"] % this.recipe["eachQTY"]) )
            {
                ob["eachQTY"] = "必須整除總片數"
            }
            else
            {
                ob["eachQTY"] = ""
            }
            return ob
        },
    },
    watch:
    {
        async isRefresh(val)
        {
            if(val)
            {
                await this.getLockStatus()
                this.$emit('finishRefresh')
            }
        },
        // isValidMsg:
        // {
        //     handler: function (val)
        //     {
        //         let r = false
        //         Object.keys(val.forEach( (k) =>
        //         {
        //             r = (r || !!val[k])
        //         }))
        //         this.isValid = r
        //     },
        //     deep: true
        // },
        redis_msg(value)
        {
            let val = value['msg']

            if(this.stage == 1)
            {
                if(val["target"].length < 8)
                {
                    Toast.info("RFID讀取到工號:" + val["target"])
                    this.operator = val["target"]
                }
                else
                {
                    Toast.info("RFID讀取到批號:" + val["target"])
                    this.lot = val["target"]
                }
            }
        },
    },
    async beforeCreate()
    {
    },
    async created()
    {

    },
    async beforeMount()
    {

    },
    activated()
    {
        this.getLockStatus()
    },
    async mounted()
    { 
        this.spec = this.$store.state.spec
    },
    async beforeDestroy()
    {
        // let tmep = {}
        // Object.keys(this.$data).forEach(key =>
        // {
        //     tmep[key] = this.$data[key]
        // })
        // this.$store.commit('store_prod_state', tmep)
    },
    async destroy()
    {

    },
    methods:
    {
        doPaste()
        {
            navigator.clipboard.readText()
            .then( text =>
            {
                this.editDialog.overwrite = text
                Toast.succeed("貼上:" + text)
            })
        },
        async getLockStatus()
        {
            this.$store.commit('update_isLoading', true)
            await fetch('http://10.11.20.108:9999/api/isLock',
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
                Toast.succeed("成功取得資料")
                this.isLock = response["response"]
            })
            .catch( err =>
            {
                this.$notify.warning({ title: '投料失敗', message: err})
            })
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
        },

        async CreateTask(uid)
        {
            // this.$store.dispatch("_db",
            // { 
            //     url: "_db/ENG-10/_api/document/Tasks",
            //     method: "POST",
            //     payload: {
            //         lotdata: this.lotdata, 
            //         procdata: this.procdata,
            //         recipe: this.recipe,
            //         current: 0,
            //         prod: "化金製程",
            //         STAETDATETIME: moment().format('YYYY-MM-DD hh:mm:ss'),
            //         steps: [
            //             {
            //                 name: '調整站',
            //                 text: moment().format('YYYY-MM-DD hh:mm:ss'),
            //             },
            //             {
            //                 name: '化金上下料站',
            //             },
            //             {
            //                 name: '化金主站',
            //             },
            //             {
            //                 name: '化金上下料站',
            //             },
            //             {
            //                 name: '噴砂上料站',
            //             },
            //             {
            //                 name: '噴砂主站',
            //             },
            //             {
            //                 name: '噴砂下料站',
            //             },
            //             {
            //                 name: '調整站',
            //             },
            //         ],
            //     }
            // })
            await fetch('http://10.11.20.108:9999/api/tc/',
            {
                method: "POST",
                body: JSON.stringify({
                    uid: uid,
                    lotdata: this.lotdata, 
                    procdata: this.procdata,
                    recipe: this.recipe,
                    current: 0,
                    prod: "化金製程",
                    STAETDATETIME: moment().format('YYYY-MM-DD hh:mm:ss'),
                    steps: [
                        {
                            name: '調整站',
                            text: moment().format('YYYY-MM-DD hh:mm:ss'),
                        },
                        {
                            name: '化金上下料站',
                        },
                        {
                            name: '化金主站',
                        },
                        {
                            name: '化金上下料站',
                        },
                        {
                            name: '噴砂上料站',
                        },
                        {
                            name: '噴砂主站',
                        },
                        {
                            name: '噴砂下料站',
                        },
                        {
                            name: '調整站',
                        },
                    ],
                    })
            })
            .then( response => { return response.json() })
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                } 
            })
            .catch( err =>
            {
                this.$notify.warning({ title: '建立任務失敗', message: err})
                this.errMsg = err
            })
            .finally( () => {} )
        },
        async prod(target)
        {
            this.$store.commit('update_isLoading', true)
            this.errMsg = ""
            // 生成uid
            let uid =  Math.floor(Math.random() * 1024) + 1
            await fetch('http://10.11.20.108:9999/api/prod/'+ target,
            {
                method: "POST",
                body: JSON.stringify({
                        uid : uid,
                        lotdata: this.lotdata, 
                        procdata: this.procdata,
                        recipe: this.recipe,
                    })
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                Toast.succeed("投料成功")
                this.CreateTask(uid)
                this.clean()
                this.isDone = true
            })
            .catch( err =>
            {
                this.$notify.warning({ title: '投料失敗', message: err})
                this.errMsg = err
                this.isFailed = true
            })
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
        },

        editDialogEnter(val)
        {
            Toast({ content: val, position: 'top', duration: 1000})
            this.editDialog.overwrite += val
        },

        editDialogDelete()
        {
            if (this.editDialog.overwrite === '')
            {
                return
            }
            this.editDialog.overwrite = this.editDialog.overwrite.substr(0, this.editDialog.overwrite.length - 1)
        },

        editDialogConfirm()
        {
            Toast({ content: this.editDialog.target + "->" + this.editDialog.overwrite,
                position: 'top', duration: 2000, icon: 'edit' })
            this.editDialog.open = false
            this._.set(this.$data, this.editDialog.target_key, this.editDialog.overwrite)
        },

        openDialog(target)
        {
            this.editDialog.target_key = target.split('.')
            // this.editDialog.target = undefined
            // this._(this.editDialog.target_key).forEach( (value) =>
            // {
            //     this.editDialog.target ? 
            //         this.editDialog.target = this.editDialog.target[value] :
            //         this.editDialog.target = this.$data[value]
            // })
            this.editDialog.target = this._.get(this.$data, this.editDialog.target_key)
            this.editDialog.open = true
            this.editDialog.overwrite = ""
        },
        keyFormatter(val)
        {
            if (val === '.')
            {
                return this.keyBoardRender
            }
        },
        async prepare()
        {
            if(this.lot == "" || this.operator == "" )
            {
                Toast.failed('請輸入批號/工號')
                return
            }
            if(await this.getRecipe())
            {
                this.stage ++
            }
        },
        clean()
        {
            if(this.stage == 2)
            {
                this.stage = 1
            }
            else
            {
                this.lot = ''
                this.operator = ''
                this.procseq = ''
            }
        },
        async spec_reload()
        {
            this.$store.commit('update_recipe_spec', await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/document/SETTINGS/RECIPE", method: "GET", payload: {}}))
            this.spec = this.$store.state.spec
            Toast.succeed("更新成功")
        },
        async getRecipe()
        {
            this.$store.commit('update_isLoading', true)
            this.payload["mfdata"]["lotdata"]["no"] = this.lot
            this.procseq == 0 ? 
                this.payload["mfdata"]["lotdata"]["procseq"] = null :
                this.payload["mfdata"]["lotdata"]["procseq"] = this.procseq
            let x2js = new X2JS()
            x2js.js2xml(this.payload)
            return await this.$axios({ method: 'get', url: 'http://mesap/mesws_chpt/wsmes/wsmes.asmx/GetParameter?InXml='+x2js.js2xml(this.payload)})
            .then( response =>
            {
                let res = response["data"]
                res = x2js.xml2js(res)
                res = res["string"]["__text"]
                res = res.replace(/(μ")/g, 'μ') /*特殊字元取代*/
                res = x2js.xml2js(res)
                if(! Object.keys(res).includes("mfdata"))
                {
                    throw "參數返回格式不符合預期"
                }
                if(res["mfdata"]["exception"])
                {
                    throw res["mfdata"]["exception"]
                }
                if(!res["mfdata"]["procdata"]["procname"].match(/化金/g)) /*檢查是否為化金站參數*/
                {
                    throw "非化金站參數! 請重新檢查製程序!"
                }
                this.lotdata = res["mfdata"]["lotdata"]
                this.procdata = res["mfdata"]["procdata"]
                for(let item of this.procdata["procprams"]["procpram"])
                {
                    if(item.procprammes in this.recipe)
                    {
                        this.recipe[item.procprammes] = +item.procvalue
                    }
                }
                this.recipe["eachQTY"] = 2
                Toast.succeed("成功取得製程參數")
                return true
            })
            .catch( err =>
            {
                this.$notify.warning({ title: 'MES回應異常', message: err})
                return false
            })
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
        }
    }
}
</script>

<style scoped>
.el-row
{
    margin-bottom: 20px;
}
.c
{
    height: 715px;
}
.errMsg
{
    font-size: 36px;
    color: #f54838;
}
.dialog
{
    height: 650px;
}
</style>
