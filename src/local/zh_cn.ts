export const zhHans = {
    label: '简体中文',
    go_home: '返回主页',
    go_account_manage: '返回账号管理',
    login_account: '测试登录账号',
    no_file_selected: '未选择文件',
    ws: {
        error: 'WS连接已断开，请尝试刷新网页',
        error_reconn_r: 'WS正在尝试重新连接',
        error_reconn: 'WS连接已断开，正在尝试重新连接',
        error_reconn_t: 'WS连接已断开，{0}秒后尝试重连',
    },
    admin_panel: {
        login: '游戏账号登录',
        battle: '游戏账号战斗',
        ap_supply: '使用理智药',
        penguin_report_err: '企鹅物流异常汇报',
        battle_ss: '战斗需要截图',
        battle_inj: '战斗需要注入模式',
        bypass_gt: '自动Bypass极验验证',
        ann_success: '系统公告已更新！',
        ann_error: '系统公告更新失败！{0}',
        conf_success: '配置已更新！',
        conf_error: '配置更新失败！{0}',
    },
    game: {
        freeze: {
            not_kill: "冻结失败：账号 {0} 代理未结束，请先结束代理！",
            success: "账号 {0} 已成功冻结，请进入冻结列表解冻账号！",
        },
        troop: {
            filter_star: '筛选星级',
            filter_prof: '筛选职业',
        },
        restart: {
            success: '账号 {0} 重启完成~',
        },
        setting: {
            reset_title: '还原用户设置',
            reset_confirm: '此操作将还原您的设置到初始化状态，并且无法恢复，您需要重新对需要的配置进行设置。',
            reset_btn: '确认还原{0}的设置',
            get_success: '账号 {0} 设置获取成功！',
            set_success: '账号 {0} 设置保存成功！',
            reset_success: '账号 {0} 设置重置成功！',
            game_not_init: '设置错误：账号 {0} 未开启！',
            game_not_exist: '设置错误：账号 {0} 不存在！',
        },
        plan_recruit: {
            success_all: '公开招募开启成功'
        },
        operation: {
            plan_all_recruit: '自动开始全部公开招募',
            get_fr_clue: '获取好友线索',
            start_info_share: '放上线索&尝试开启线索交流',
            try_buy_social_good: '购买信用商店物品',
            mission_submit_daily: '递交每日任务',
            mission_submit_weekly: '递交每周任务',
            force_build_reschedule: '强制基建换班',
            mail_recv_all: '收取全部邮件',
            quickacs: {
                tbs_suc: '尝试购买信用商店物品指令正在执行中',
                sis_suc: '尝试开启线索交流指令正在执行中',
                gfc_suc: '获取好友线索指令正在执行中',
                sad_suc: '提交每日任务指令正在执行中',
                saw_suc: '提交每周任务指令正在执行中',
                fbr_suc: '提交基建换班指令正在执行中',
                ram_suc: '收取所有邮件指令正在执行中',
            },
            recruit: {
                inst_success: '当前公招槽加速完成~',
                inst_err: '当前公招槽加速失败！',
                fin_success: '完成当前公招槽干员招募~{0}',
                fin_err: '当前公招槽干员招募错误！',
                stop_success: '停止公招完成',
                stop_err: '停止错误：当前公招已完成或未开始',
                sel_success: '当前公招槽Tag选择完成~',
                sel_err: '当前公招槽Tag选择错误！',
                ref_state_fail: '当前公招槽刷新失败(槽状态异常)！',
                ref_success: '完成当前公招槽刷新~',
                ref_err: '当前公招槽刷新错误！',
            },
        },
        act: {
            easy_acs: '快捷指令',
            recruit: '公招',
            building: '基建',
            friend: '好友',
            mail: '邮件',
            about: '关于',
            activity: '活动',
            aa: 'TND'
        },
        anal: {
            gamedata: '游戏数据',
            wealth: '资产分析',
            building: '基建分析',
            gacha: '招募分析',
            troop: '干员分析',
            dungeon: '关卡分析',
            about: '关于',
            btn: {
                refresh: '刷新',
                get_all: '获取全部',
                get: '获取',
                dump: '保存',
            },
            action: {
                ref_gd: '成功刷新游戏元数据',
                getall_success: '成功获取全部游戏元数据',
                getall_success_gsp: '成功获取全部GSP数据',
                getall_err: '获取全部游戏元数据失败！',
                getall_err_gsp: '获取游戏GSP数据失败！',
                ref_gsp: '成功刷新GSP数据',
            }
        },
        create: {
            user_not_exist: '你在做什么？',
            account_exist: '游戏账号 {0} 已存在！',
            account_exist_other: '游戏账号 {0} 已在另一个账号中存在！',
            account_running: '游戏账号 {0} 已被创建！',
            success: '游戏账号 {0} 创建成功！'
        },
        delete: {
            acc_not_exist: '删除错误:账号 {0} 不存在',
            game_not_exist: '删除错误:账号 {0} 不存在',
            success: '删除账号 {0} 成功',
            running: '删除错误:账号 {0} 正在运行，请先停止'
        },
        start: {
            global_disabled: '账号登录已被全局禁用，请等待维护结束！',
            success: '账号 {0} 开启成功',
            game_not_exist: '开启失败：账号 {0} 不存在',
            game_already_start: '开启失败：账号 {0} 正在运行'
        },
        stop: {
            success: '账号 {0} 关闭成功',
            game_not_exist: '关闭失败：账号 {0} 不存在',
            game_not_start: '关闭失败：账号 {0} 未开启'
        },
        info: {
            game_not_exist: '获取账号信息失败: 账号 {0} 不存在',
            game_not_start: '获取账号信息失败: 账号 {0} 未开启',
            game_not_init: '获取账号信息失败: 账号 {0} 未初始化',
            tfs_not_init: '好友数据未初始化，请稍后再试',
            success: {
                get_info: '获取账号信息成功',
            },
            execute: {
                success: '指令{0}执行成功',
                finish: '指令{0}执行完成',
                game_not_exist: '指令{0}执行失败：账号未开启或不存在',
            },
            usercard: '玩家名片',
            alerts: '提醒',
            current_ap: '当前理智(最大',
            recruit_inuse: '使用中的公招槽',
            campagn: '本周剩余剿灭作战合成玉',
            info_share: '当前线索交流状态'
        },
        alert: {
            train_finish: '专精室干员已完成专精，请及时查看~',
            lgacha_dfree: '您有免费一抽还未使用，请及时使用！',
            has_mail: '您有新的邮件，请注意查收',
            has_friend_request: '您有新的好友申请，请及时处理',
            ap: '今日理智剩余过多，请及时处理，不要浪费啦！',
            monthly_sub: '您的月卡将于 {0} 到期，请及时补(ke)充(jin)~',
            game_failed: '当前登录已失效(被异地登录)，请关闭并重新开启！',
            campaign: '您本周剿灭作战中还有{0}合成玉未获取，不要错过了喔',
            info_share: '您当前已满足开启线索交流的条件，可以开启线索交流',
            consumable: '您当前有部分消耗品即将过期：{0}，请注意使用！',
            recruit_finish: '您有{0}个公招已完成，记得及时去聘用~',
            mission_d: '您本日任务还未全部完成，还不可以休息哦~',
            mission_w: '您本周任务还未全部完成，请及时查看并完成',
            climb_tower: '您本次保全派驻周期还未完成，请及时完成！',
        }
    },
    account: {
        welcome: ' Dr.{0}，欢迎来到Project AOP',
        current: '当前游戏账号',
        inrunning: '运行中的账号',
        user_level: '当前账号等级',
        game_account: '游戏账号列表',
        name: '名称',
        account: '账号',
        platform: '平台',
        status: '状态',
        operation: '操作',
        refresh_monitor: '刷新监控列表',
        logger: '最新日志',
        change_type: '切换监控模式',
        change_freeze: '切至冻结列表',
        change_freeze_1: '切至常规列表',
        change_simple: '切换布局',
        create_account: '新建账号',
        reload_account: '刷新列表',
        sync_success: '同步游戏账号数据成功，已同步{0}个账号信息',
        create_btn: '创建账号',
        create_welcome: '欢迎来到创建账号向导，您可以在这里创建一个新的游戏账号，并将其托管到GAOP。',
        create_account_empty: '添加账号表单部分为空：{0}',
        delete_btn: '删除账号',
        delete_deny: '取消',
        delete_confirm: '警告：删除操作将不可恢复，所有账号记录及账号信息将被清除！',
        delete_title: '确认删除账号{0}',
        stop_all_account: '全部停止',
        stop_all_account_success: '已停止全部账号',
        freeze_start: '冻结开始日期',
        remarks: '账号备注信息',
        event: {
            upd_success: '更新事件成功！',
            upd_error: '更新事件失败！',
            get_success: '获取事件列表成功！',
            get_error: '获取事件列表失败！',
            del_success: '删除事件成功！',
            del_error: '删除事件失败！',
            add_success: '添加事件成功！',
            add_error: '添加事件失败！',
        },
        tabs: {
            info: '玩家信息',
            setting: '账号设置',
            inventory: '玩家仓库',
            troop: '干员列表',
            analytics: '数据分析',
            module: '模块管理',
            operation: '游戏操作',
            logger: '游戏日志',
            terminal: '命令执行',
            schedule: '任务规划',
        },
        autologin:{
            set_enable:{
                error: "设置自动登录失败：{0}",
                success: "设置自动登录成功",
                not_found: "设置自动登录失败：账号{0}不存在",
            }
        }
    },
    logger: {
        time: '日志时间',
        level: '日志等级',
        info: '日志内容',
    },
    login: {
        error: {
            password_empty: '密码不能为空',
            username_empty: '账号不能为空',
            nickname_empty: '昵称不能为空',
        },
        notice_reg: '加入大群，与我们一同进化',
        forget: '忘记密码',
        switch_serv: '切换服务器',
        title: '用户登录',
        username: '用户名',
        password: '密码',
        nickname: '昵称',
        login: '登录',
        register: '注册 >',
        auth_fail: '用户名不存在或密码错误',
        banned: '该账号已被封禁',
        success: 'Dr.{0},欢迎回来~',
    },
    register: {
        error: {
            username_empty: '注册账号名称不能为空',
            password_empty: '注册密码不能为空',
            invite_empty: '邀请码不能为空',
        },
        title: '用户注册',
        notice: '当前模式为邀请制度，请向管理员索要邀请码。',
        username: '注册用户名',
        password: '注册密码',
        invitecode: '邀请码',
        register: '注册',
        success: '恭喜您，注册成功~',
        back_login: '< 返回登录'
    },
    theme: {
        language: '语言设置',
        setting: '主题设置',
        color_opt: '颜色选择',
        dark_mode: '主题设置',
        server: '服务器设置',
        background: '背景设置',
        background_change: '切换背景',
        opacity: '透明度设置',
    },
    rule: {
        required: '请输入{0}'
    },
    error: {
        data_not_up_to_date: '当前游戏数据并非最新数据，可能会有部分素材缺失！(缺少:{0})',
        server_code_exception: '服务器指令执行出现错误，已上报管理员。',
        access_denied: '(๑‾᷅^‾᷅๑)您没有访问权限哦',
        not_found: '∑(っ°Д°;)っ卧槽！网页消失了',
        server_err: '(。-ω-)zzz让服务器休息会儿吧',
        api_failed: 'API错误',
        net_err: '服务器网络错误或连接断开',
        proxy_in_function: '┓(;´_｀)┏账号正在执行其他指令哦，请等一下吧',
        game_failed: '登录已经失效啦，请重新开启账号喔',
        login_failed: '游戏登录出错，请重新开启账号',
        account_not_start: '当前账号还未开启，请到账号管理进行开启',
        account_not_found: '账号信息不存在或已更新，请重新同步账号列表',
        account_not_start_title: '错误：账号还未启用',
        account_not_found_title: '错误：未知的账号',
        account_not_exist: '账号未开启或信息不存在！',
        account: {
            create: {
                code_no_surplus: '注册错误:邀请码已被使用',
                account_already_exist: '注册错误:该用户名已存在',
                code_not_exist: '注册错误:注册码不存在'
            },
        },
    },
    menu: {
        undefined: '',
        Login: '登录',
        reader: '剧情浏览器',
        home: '主页',
        dashboard: '状态汇总',
        accounts: '账号',
        account_manage: '账号管理',
        settings: '设置',
        test: '测试页面',
        about: '关于',
        cards: '卡片',
        arkdb: '方舟数据库',
        gacha: '宰人航天',
        test_spine: 'Spine测试',
        admin: '管理',
        ark_db: '方舟数据库',
        script: '脚本模块',
        account: {
            dashboard: '账号控制面板',
        },
    },
    server: {
        title: '切换服务器',
        title_diy: '自定义服务器设置',
        desc: '请确认是否切换至 {0} 服务器？',
        desc_diy: '请输入自定义服务器Host(例：192.168.1.1:8080)',
        host: '服务器域名端口',
        confirm: '确认切换',
        cancel: '取消',
        server_name: '目标服务器：{0}',
        server: '服务器IP：{0}',
        secure: '是否启用https加密：{0}',
        alert: '警告：切换服务器会强制退出当前账号，您需要重新进行登录；当目标服务器故障时；您可能无法正常进行登录；请点击左下角返回稳定服返回。',
        switch_suc: '服务器切换成功',
        force_switch: '服务器强制切换：“{0}“重定向到{1}://{2}',
        switch_err: '服务器切换失败：数据不全',
    },
    setting: {
        logout: '退出登录',
        settings: '设置',
        account_mng: '账号管理',
    },
    captcha: {
        title: '需要验证码',
        desc: '当前账号需要验证码登录，请等待并完成下面的验证码操作，请注意：本验证码仅能使用一次，若未完成验证前刷新页面则需要重新进行登录验证流程',
        status: "验证码状态：{0}",
    },
    module: {
        addsre: '导入分享',
        announce: '欢迎来到用户模块列表，当前共有{0}个模块',
        module_cnt: '上传模块数量',
        remain_ts: '剩余编译时间',
        upload_new: '上传新模块',
        enable_new: '启用新模块',
        deploy_new: '部署到游戏账号',
        share_new: '导入分享模块',
        hot_upd: '当前账号模块状态已更改，请重启游戏代理以生效',
        upload_info: '作为旁侧辅助模块，您可以上传自己的辅助模块，上传成功后可以在模块列表中查看您上传的模块的状态，并进行后续操作。',
        enable_info: '请通过脚本模块页“分享部署连接”复制，或通过他人分享获取脚本代码，然后在下方粘贴即可启用。',
        deploy_info: '将当前模块部署到您游戏账号中，并设定是否要启用。',
        name: '模块名称',
        desc: '模块描述（可选）',
        enable_desc: '请粘贴脚本代码。\n支持批量启用多条脚本，每行一条，支持粘贴多条脚本代码，每条代码之间用回车分隔。',
        delete_confirm: '删除模块将会同时删除已编译的模块，同时该模块将无法继续用于任何账号（包括分享过的其他用户），是否确认删除？',
        delete_title: '确认删除模块',
        delete_btn: '删除模块',
        error: {
            name_empty: '模块名称不能为空',
            no_script_selected: '未选择脚本模块文件',
            no_script_name: '模块名称不能为空',
            no_script_content: '模块内容不能为空',
            compile_no_hash: '编译失败：未获取到待编译模块Hash',
        },
        info: {
            copy_success: '复制成功~',
            copy_fail: '复制失败！可能不支持复制，请手动复制模块代码',
            del: '已删除',
            shared: '分享模块',
            dberr: '未知或已损坏的模块信息！',
            create_ts: '创建时间',
            desc: '模块描述',
            no_desc: '无模块描述',
            hash: '模块代码',
            in_compiled: '编译进行中，请稍后',
            current_state: '当前状态：',
            compile: '开始编译',
            m_name: '模块名称',
            m_ver: '模块版本',
            m_type: '模块类型',
            m_ref: '反馈信息',
            del_btn: '删除当前模块',
            share_btn: '分享部署链接',
            apply_btn: '批量快速执行',
            deploy_btn: '批量部署',
            run_once: '执行模块',
            mod_del: '模块已删除',
            mod_ena: '模块已启用',
            mod_ena_b: '禁用当前模块',
            mod_dis: '模块已禁用',
            mod_dis_b: '启用当前模块',
        },
        list: {
            title: '用户模块列表',
            failed: '获取用户模块列表失败',
            ok: '获取用户模块列表成功',
        },
        list_game: {
            ok: '获取账号模块列表成功',
        },
        listall: {
            account_not_found: '未知的账号信息！',
            permission_denied: '您没有权限查看模块列表！',
            failed: '获取模块列表失败',
            ok: '获取模块列表成功',
        },
        upload: {
            account_not_found: '模块上传失败：未知的上传者，请登录后上传！',
            permission_denied: '模块上传失败：当前暂时不支持上传模块',
            failed: '上传失败：平台已存在同样的模块，请对模块内容进行修改或获取他人分享的链接',
            ok: '模块上传成功！',
            ts: '请选择TypeScript文件',
        },
        delete: {
            not_found: '未找到待删除模块',
            not_owner: '您不是该模块的所有者，无法删除',
            already_deleted: '该模块已被删除',
            failed: '删除模块异常',
            success: '删除您的模块成功，所有用户均无法使用该模块',
            success1: '删除分享的模块成功，若需要您可以通过模块代码再次添加此模块',
        },
        quickdeploy: {
            ok: '完成模块批量部署，成功：{0}个，失败{1}个'
        },
        shared: {
            not_found: '未找到该分享模块',
            deleted: '该分享模块已被删除',
            compiled_error: '该分享模块编译失败，无法分享',
            self: '您不能分享自己的模块',
            already_have: '您已经添加过该分享模块',
            success: '分享模块添加成功',
        },
        compile: {
            start: '开始编译，编译过程至多需要15秒，请耐心等待',
            ok: '编译完成，耗时{0}ms，编译结果：{1}',
            failed: '编译失败，耗时{0}ms，错误信息：{1}',
            init_failed: '编译成功但初始化失败，耗时{0}ms，错误信息：{1}',
            save_failed: '编译成功但保存失败，耗时{0}ms，错误信息：{1}',
            not_found: '未找到待编译模块',
            not_owner: '您不是该模块的所有者，无法编译',
            in_compiled: '该模块正在编译中，请稍后再试',
            already_compiled: '该模块已编译完成，无需重复编译',
        },
        addgame: {
            already_added: '该模块已被添加到当前账号',
            not_found: '未找到待添加模块，是否已被删除？',
            not_compiled: '该模块尚未编译完成，无法添加',
            failed: '添加模块异常',
            success: '添加模块成功，重启账号代理后生效',
        },
        delgame: {
            no_mod: '未找到待删除模块，请检查模块代码',
            not_found: '未找到待删除模块',
            failed: '删除模块异常',
            success: '删除模块成功，重启账号代理后生效',
        },
        setgame: {
            no_mod: '未找到待设置模块，请检查模块代码',
            not_found: '未找到待设置模块',
            failed: '设置模块信息异常',
            success: '设置模块信息成功',
        },
        list_user: {
            title: '玩家模块状态表',
        },
        deploy: {
            select_account: '请选择要部署的账号！',
        }
    },
    arkdb: {
        title: {
            char: '干员数据',
            enemy: '敌人数据',
            item: '物品数据',
        }
    },
    logout: '登出成功！',
}