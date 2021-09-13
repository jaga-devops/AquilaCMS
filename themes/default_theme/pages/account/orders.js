import React from 'react';
import Head from 'next/head';
import moment from 'moment';
import {
    NSPageAccountOrders,
    NSContext,
    NSSidebarAccount,
    imgDefaultBase64,
    statusColor
} from 'aqlrc';
import ModalR from 'react-responsive-modal';
import Layout from 'components/Layout';
import { Link, Router } from 'routes';
import { withI18next } from 'lib/withI18n';

/**
 * PageAccountOrders - Page des commandes client (surcharge NSPageAccountOrders)
 * @return {React.Component}
 */

class PageAccountOrders extends NSPageAccountOrders {
    render() {
        const {
            lang, oCmsHeader, oCmsFooter, sitename, t, taxDisplay
        } = this.props;
        moment.locale(lang);
        const { openModalConfirmCancel, orders } = this.state;
        return (
            <NSContext.Provider value={{ props: this.props, state: this.state, onLangChange: (l) => this.onLangChange(l) }}>
                <Layout header={oCmsHeader.content} footer={oCmsFooter.content}>
                    <Head>
                        <title>{sitename} | {t('account:orders.title')}</title>
                    </Head>
                    <div className="page-content page-content--with-border">
                        <div className="main">
                            <div className="shell">
                                <div className="container container--flex align-top">
                                    <div className="content content--alt content--left">
                                        <section className="section-client-area">
                                            <header className="section__head">
                                                <h2 className="section__title">
                                                    <i className="ico-profile-large" />
                                                    {t('account:account.page.title')}
                                                </h2>
                                            </header>
                                            <h6>{t('account:orders.sub_title')}</h6>
                                            <div className="section__content">
                                                <div className="form">
                                                    <form action="?" method="post">
                                                        <div className="form__body">
                                                            <div className="form__group">
                                                                <div className="accordion">
                                                                    {
                                                                        orders.length ? orders.map((order, index) => (
                                                                            <div key={order._id} className={this.state.isActive[index] ? 'accordion__section order expand' : 'accordion__section order'}>
                                                                                <div className="accordion__head" onClick={() => this.switchActive(index)}>
                                                                                    <div className="order-head">
                                                                                        <h6>{t('account:orders.page.label.order_num')} <strong>{order.number}</strong> - {moment(order.createdAt).format('L')}</h6>
                                                                                        <span className="status">{statusColor(order.status, this.props.t)}</span>
                                                                                        <strong className="price">
                                                                                            {
                                                                                                order.priceTotal && order.priceTotal[taxDisplay[index]] !== undefined
                                                                                                    ? order.priceTotal[taxDisplay[index]].toFixed(2)
                                                                                                    : ''
                                                                                            } €
                                                                                        </strong>
                                                                                    </div>{/* <!-- /.order-head --> */}
                                                                                </div>{/* <!-- /.accordion__head --> */}

                                                                                <div className="accordion__body">
                                                                                    <div className="order-sum">
                                                                                        <div className="table-order">
                                                                                            <table>
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th>{t('account:orders.page.label.article')}</th>
                                                                                                        <th>{t(`account:orders.page.label.unit_price.${taxDisplay[index]}`)}</th>
                                                                                                        <th>{t(`account:orders.page.label.total.${taxDisplay[index]}`)}</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                    {
                                                                                                        order.items.map((item) => {
                                                                                                            let basePrice = null;
                                                                                                            let descPromo = '';
                                                                                                            let descPromoT = '';
                                                                                                            if (order.quantityBreaks && order.quantityBreaks.productsId.length) {
                                                                                                                // On check si le produit courant a recu une promo
                                                                                                                const prdPromoFound = order.quantityBreaks.productsId.find((productId) => productId.productId === item.id.id);
                                                                                                                if (prdPromoFound) {
                                                                                                                    basePrice = prdPromoFound[`basePrice${taxDisplay[index].toUpperCase()}`];
                                                                                                                    descPromo = (
                                                                                                                        <del><span className="price" style={{ color: '#979797' }}>{(basePrice).toFixed(2)}€</span></del>
                                                                                                                    );
                                                                                                                    descPromoT = (
                                                                                                                        <del><span className="price" style={{ color: '#979797' }}>{(basePrice * item.quantity).toFixed(2)}€</span></del>
                                                                                                                    );
                                                                                                                }
                                                                                                            }
                                                                                                            let imgDefault = imgDefaultBase64;
                                                                                                            let imgAlt = 'illustration produit';
                                                                                                            if (item.id && item.id.images && item.id.images.length) {
                                                                                                                let foundImg;
                                                                                                                foundImg = item.id.images.find(img => img.default)
                                                                                                                if(item.selected_variant) foundImg = item.selected_variant.images.find(img => img.default)
                                                                                                                if (foundImg) {
                                                                                                                    imgDefault = foundImg._id !== 'undefined' ? `/images/${item.selected_variant ? 'productVariant' : 'product'}/82x82/${foundImg._id}/${item.id.slug[lang]}${foundImg.extension}` : imgDefault;
                                                                                                                    imgAlt     = foundImg.alt || imgAlt;
                                                                                                                } else if(item.id && item.id.images) {
                                                                                                                    imgDefault = item.id.images[0]._id !== 'undefined' ? `/images/${item.selected_variant ? 'productVariant' : 'product'}/82x82/${item.id.images[0]._id}/${item.id.slug[lang]}${item.id.images[0].extension}` : imgDefault;
                                                                                                                    imgAlt     = item.id.images[0].alt || imgAlt;
                                                                                                                }
                                                                                                            }
                                                                                                            return (
                                                                                                                <tr key={item._id}>
                                                                                                                    <td>
                                                                                                                        <div className="product-small">
                                                                                                                            <div className="product__image">
                                                                                                                                <img src={imgDefault} alt={imgAlt} />
                                                                                                                            </div>{/* <!-- /.product__image --> */}
                                                                                                                            <div className="product__content">
                                                                                                                                <h6>{(item.name || 'NO NAME')} x {item.quantity}</h6>
                                                                                                                                <p>
                                                                                                                                    {
                                                                                                                                        item.id && item.id.description1 && item.id.description1.title
                                                                                                                                            ? item.id.description1.title
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                </p>
                                                                                                                                {
                                                                                                                                item.type === 'bundle' && <ul style={{ listStyle: 'none' }}>
                                                                                                                                    {
                                                                                                                                        item.selections.map((section) => (
                                                                                                                                            section.products.map((productSection, indexSel) => {
                                                                                                                                                return (
                                                                                                                                                <li key={indexSel}>{productSection.name} {`${(item.id.bundle_sections.find((bundle_section) => bundle_section.ref === section.bundle_section_ref) &&
                                                                                                                                                    item.id.bundle_sections.find((bundle_section) => bundle_section.ref === section.bundle_section_ref).products.find((product) => product.id === productSection.id) &&
                                                                                                                                                    item.id.bundle_sections.find((bundle_section) => bundle_section.ref === section.bundle_section_ref).products.find((product) => product.id === productSection.id).modifier_price &&
                                                                                                                                                    item.id.bundle_sections.find((bundle_section) => bundle_section.ref === section.bundle_section_ref).products.find((product) => product.id === productSection.id).modifier_price[taxDisplay[index]]) ?
                                                                                                                                                    (item.id.bundle_sections.find((bundle_section) => bundle_section.ref === section.bundle_section_ref).products.find((product) => product.id === productSection.id).modifier_price[taxDisplay[index]] > 0 ?
                                                                                                                                                        '+' :
                                                                                                                                                        '') +
                                                                                                                                                    item.id.bundle_sections.find((bundle_section) => bundle_section.ref === section.bundle_section_ref).products.find((product) => product.id === productSection.id).modifier_price[taxDisplay[index]] + '€' :
                                                                                                                                                    ''
                                                                                                                                                    }`}</li>
                                                                                                                                            )})
                                                                                                                                        ))
                                                                                                                                    }
                                                                                                                                </ul>
                                                                                                                                }
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td className="hidden-xs">
                                                                                                                        {
                                                                                                                            item.price.special && item.price.special[taxDisplay[index]]
                                                                                                                                ? (
                                                                                                                                    <del><span className="price" style={{ color: '#979797' }}>{item.price.unit[taxDisplay[index]].toFixed(2)}€</span>
                                                                                                                                    </del>
                                                                                                                                )
                                                                                                                                : descPromo
                                                                                                                        }
                                                                                                                        <strong className="price">{this.getUnitPrice(item, order).toFixed(2)}€</strong>
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        {
                                                                                                                            item.price.special && item.price.special[taxDisplay[index]]
                                                                                                                                ? (
                                                                                                                                    <del><span className="price" style={{ color: '#979797' }}>{(item.price.unit[taxDisplay[index]] * item.quantity).toFixed(2)}€</span>
                                                                                                                                    </del>
                                                                                                                                )
                                                                                                                                : descPromoT
                                                                                                                        }
                                                                                                                        <strong className="price">{(this.getUnitPrice(item, order) * item.quantity).toFixed(2)}€</strong>
                                                                                                                    </td>
                                                                                                                    {
                                                                                                                        item.type === 'virtual' && (
                                                                                                                            <td>
                                                                                                                                <button type="button" className="btn btn--grey" onClick={() => this.downloadVirtual(item)}><span className="btn__content">{t('account:orders.page.label.download')}</span></button>
                                                                                                                            </td>
                                                                                                                        )
                                                                                                                    }
                                                                                                                </tr>
                                                                                                            );
                                                                                                        })
                                                                                                    }
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>{/* <!-- /.table-order --> */}
                                                                                        <div className="order__entry">
                                                                                            <p>
                                                                                                {t('account:orders.page.label.delivery_date')} {moment(order.delivery.date).format('DD/MM/YYYY')}  <br />
                                                                                                {t('account:orders.page.label.to_address')}: {this.getDeliveryAddress(order)}
                                                                                            </p>
                                                                                        </div>{/* <!-- /.order__entry --> */}
                                                                                        <footer className="order__foot">
                                                                                            <div className="order__discount">
                                                                                                <p>
                                                                                                    {t(`account:orders.page.label.total_order.${taxDisplay[index]}`)} : <strong>{order.priceTotal[taxDisplay[index]].toFixed(2)}€</strong><br />
                                                                                                    {
                                                                                                        order.delivery && order.delivery.price && order.delivery.price[taxDisplay[index]] > 0
                                                                                                            ? <sub>{t(`account:orders.page.label.total_delivery.${taxDisplay[index]}`)} : <strong>{order.delivery.price[taxDisplay[index]].toFixed(2)}€</strong><br /></sub>
                                                                                                            : ''
                                                                                                    }
                                                                                                    {
                                                                                                        order.quantityBreaks && order.quantityBreaks[`discount${taxDisplay[index].toUpperCase()}`]
                                                                                                            ? (
                                                                                                                <sub>{t('account:orders.page.label.cart_discount')} <strong>-{order.quantityBreaks.discountATI.toFixed(2)}€</strong><br /></sub>
                                                                                                            ) : ''
                                                                                                    }
                                                                                                    {
                                                                                                        order.promos && order.promos.length && (order.promos[0].productsId.length === 0)
                                                                                                            ? <sub>{t('account:orders.page.label.discount')}: <strong>-{order.promos[0][`discount${taxDisplay[index].toUpperCase()}`].toFixed(2)}€</strong> - {t('account:orders.page.label.discount_code')} : {order.promos[0].code}</sub>
                                                                                                            : ''
                                                                                                    }
                                                                                                    {
                                                                                                        order.additionnalFees[taxDisplay[index]] > 0
                                                                                                            ? <sub>{t('account:orders.page.label.additionnal_fees')}: <strong>{order.additionnalFees[taxDisplay[index]].toFixed(2)}€</strong></sub>
                                                                                                            : ''
                                                                                                    }
                                                                                                </p>

                                                                                            </div>{/* <!-- /.order__discount --> */}
                                                                                            <div className="order__payment">
                                                                                                <p>
                                                                                                    {t('account:orders.page.label.payment_mode')}<br />
                                                                                                    <em>
                                                                                                        {order.payment.length > 0 && order.payment[0] && (order.payment[0].name || order.payment[0].mode)}<br />
                                                                                                        {`${t(`account:orders.page.label.paidTax.${taxDisplay[index]}`)}`}
                                                                                                    </em>
                                                                                                </p>
                                                                                            </div>{/* <!-- /.order__payment --> */}
                                                                                        </footer>{/* <!-- /.order__foot --> */}

                                                                                        <div className="order__actions">
                                                                                            <ul>
                                                                                                {
                                                                                                    order.delivery && order.delivery.url
                                                                                                        ? <li><a href={order.delivery.url} target="_blank" rel="noreferrer">{t('account:orders.page.label.follow_my_order')}</a></li>
                                                                                                        : ''
                                                                                                }
                                                                                                {
                                                                                                    !['BILLED', 'DELIVERY_PROGRESS', 'DELIVERY_PARTIAL_PROGRESS', 'ASK_CANCEL', 'CANCELED', 'RETURNED'].includes(order.status) && <li style={{ cursor: 'pointer' }} onClick={() => this.openModalConfirmCancel(order._id)}>{t('account:orders.page.label.cancel_order')}</li>
                                                                                                }
                                                                                                {
                                                                                                    order.bills && order.bills.length > 0 && order.bills.map((i) => (
                                                                                                        <li key={i._id} style={{ cursor: 'pointer' }} onClick={() => this.downloadBill(i, order.number)}>
                                                                                                            {t(`account:orders.page.label.download_${i.avoir === false ? 'bill' : 'asset'}`)}
                                                                                                        </li>
                                                                                                    ))
                                                                                                }
                                                                                            </ul>
                                                                                        </div>{/* <!-- /.order__actions --> */}
                                                                                    </div>{/* <!-- /.order-sum --> */}
                                                                                </div>{/* <!-- /.accordion__body --> */}
                                                                            </div>
                                                                        )) : <p>{t('account:orders.page.label.no_order')}</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                    <NSSidebarAccount active="orders" gNext={{ Link, Router }} t={t} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <ModalR
                        animationDuration={0} classNames={{ modal: 'popup__container orders', overlay: 'popup active' }}
                        open={openModalConfirmCancel} onClose={this.onCloseModalConfirmCancel} center showCloseIcon={false}
                    >
                        <h3 className="popup__title">{t('account:orders.page.label.confirm_cancel_order')}</h3>
                        <div className="popup__body" style={{ textAlign: 'center' }}>
                            <button type="button" className="btn btn--red" onClick={this.cancelOrder}>OUI</button>
                            <button type="button" className="btn btn--red" onClick={this.onCloseModalConfirmCancel}>NON</button>
                        </div>
                    </ModalR>
                    <style jsx>{`
                    .accordion__section{
                        cursor: pointer;
                    }
                    .accordion__body{
                        cursor: auto;
                    }
                    .variant p {
                        font-size: 14px;
                        color: gray;
                    }
                `}
                    </style>
                </Layout>
            </NSContext.Provider>
        );
    }
}

export default withI18next(['account', 'common'])(PageAccountOrders);
